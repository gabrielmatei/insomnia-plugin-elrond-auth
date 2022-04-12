import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Constants } from 'src/utils/constants';
import { MaiarDexService } from '../maiar-dex/maiar-dex.service';
import { TradingInfoEntity } from '../timescale/entities/trading-info.entity';
import { TimescaleService } from '../timescale/timescale.service';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';
import { EsdtToken } from '../maiar-dex/entities/pair';

@Injectable()
export class RabbitMqPairHandlerService {
  constructor(
    private readonly maiarDexService: MaiarDexService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async handleSwapEvent(
    event: SwapFixedInputEvent | SwapFixedOutputEvent,
  ): Promise<void> {
    const tokenInIdentifier = event.getTokenIn().tokenID;
    const tokenOutIdentifier = event.getTokenOut().tokenID;

    const tokenIn = await this.maiarDexService.getToken(tokenInIdentifier);
    const tokenOut = await this.maiarDexService.getToken(tokenOutIdentifier);

    let tokenInInfo = {
      identifier: tokenIn.identifier,
      token: tokenIn,
      reserves: event.getTokenInReserves().shiftedBy(-tokenIn.decimals),
      volume: event.getTokenIn().amount.shiftedBy(-tokenIn.decimals),
    };

    let tokenOutInfo = {
      identifier: tokenOut.identifier,
      token: tokenOut,
      reserves: event.getTokenOutReserves().shiftedBy(-tokenOut.decimals),
      volume: event.getTokenOut().amount.shiftedBy(-tokenOut.decimals),
    };

    const isInvertedPair = this.isInvertedPair(tokenInInfo.identifier, tokenOutInfo.identifier);
    const isUSDCWEGLDPair = this.isUSDCWEGLDPair(tokenInInfo.identifier, tokenOutInfo.identifier);
    if (isInvertedPair || isUSDCWEGLDPair) {
      const tempInfo = tokenInInfo;
      tokenInInfo = tokenOutInfo;
      tokenOutInfo = tempInfo;
    }

    const timestamp = moment.unix(event.getTimestamp().toNumber()).toDate();
    const priceWEGLD = tokenOutInfo.reserves.dividedBy(tokenInInfo.reserves);
    const volumeWEGLD = tokenOutInfo.volume;
    const feeWEGLD = event.feeAmount.shiftedBy(-18);

    const trades: TradingInfoEntity[] = [];

    const pairSymbol = this.getPairSymbol(tokenInInfo.token, tokenOutInfo.token);
    const pairWithWEGLD = new TradingInfoEntity({
      timestamp,
      identifier: event.getDatabaseIdentifier(pairSymbol),
      firstToken: tokenInInfo.token.identifier,
      secondToken: tokenOutInfo.token.identifier,
      price: priceWEGLD.toNumber(),
      volume: volumeWEGLD.toNumber(),
      fee: feeWEGLD.toNumber(),
    });
    trades.push(pairWithWEGLD);

    if (!isUSDCWEGLDPair) {
      const currentWEGLDPrice = await this.maiarDexService.getLastWEGLDPrice(timestamp);

      const pairSymbol = this.getPairSymbol(tokenInInfo.token, Constants.WrappedUSDC);
      const pairWithUSDC = new TradingInfoEntity({
        timestamp,
        identifier: event.getDatabaseIdentifier(pairSymbol),
        firstToken: tokenInInfo.token.identifier,
        secondToken: Constants.WrappedUSDC.identifier,
        price: priceWEGLD.multipliedBy(currentWEGLDPrice).toNumber(),
        volume: volumeWEGLD.multipliedBy(currentWEGLDPrice).toNumber(),
        fee: feeWEGLD.multipliedBy(currentWEGLDPrice).toNumber(),
      });
      trades.push(pairWithUSDC);
    }

    await this.timescaleService.writeTrades(trades);
  }

  private getPairSymbol(tokenIn: EsdtToken, tokenOut: EsdtToken) {
    return `${EsdtToken.getTicker(tokenIn)}${EsdtToken.getTicker(tokenOut)}`;
  }

  private isInvertedPair(tokenInInfoIdentifier: string, tokenOutInfoIdentifier: string): boolean {
    return tokenInInfoIdentifier === Constants.WrappedEGLD.identifier && tokenOutInfoIdentifier !== Constants.WrappedUSDC.identifier;
  }

  private isUSDCWEGLDPair(tokenInInfoIdentifier: string, tokenOutInfoIdentifier: string): boolean {
    return tokenInInfoIdentifier === Constants.WrappedUSDC.identifier && tokenOutInfoIdentifier === Constants.WrappedEGLD.identifier;
  }
}
