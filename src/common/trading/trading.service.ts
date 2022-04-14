import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import moment from "moment";
import { Constants } from "src/utils/constants";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { MaiarDexService } from "../maiar-dex/maiar-dex.service";
import { SwapFixedInputEvent } from "../rabbitmq/entities/pair/swap-fixed-input.event";
import { SwapFixedOutputEvent } from "../rabbitmq/entities/pair/swap-fixed-output.event";
import { TradingInfoEntity } from "../timescale/entities/trading-info.entity";
import { TimescaleService } from "../timescale/timescale.service";

@Injectable()
export class TradingService {
  constructor(
    private readonly cachingService: CachingService,
    private readonly maiarDexService: MaiarDexService,
    private readonly timescaleService: TimescaleService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  ) { }

  public async indexEvent(event: SwapFixedInputEvent | SwapFixedOutputEvent): Promise<void> {
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

    const totalFeePercent = await this.maiarDexService.getTotalFeePercent(event.getAddress());

    const timestamp = moment.unix(event.getTimestamp().toNumber()).toDate();
    const priceWEGLD = tokenOutInfo.reserves.dividedBy(tokenInInfo.reserves);
    const volumeWEGLD = tokenOutInfo.volume;
    const feeWEGLD = volumeWEGLD.times(totalFeePercent);

    const trades: TradingInfoEntity[] = [];

    const pairWithWEGLD = new TradingInfoEntity({
      timestamp,
      identifier: event.getDatabaseIdentifier(),
      firstToken: tokenInInfo.token.identifier,
      secondToken: tokenOutInfo.token.identifier,
      price: priceWEGLD.toNumber(),
      volume: volumeWEGLD.toNumber(),
      fee: feeWEGLD.toNumber(),
    });
    trades.push(pairWithWEGLD);

    const isWEGLDUSDCPair = this.isWEGLDUSDCPair(tokenInInfo.identifier, tokenOutInfo.identifier);
    if (isWEGLDUSDCPair) {
      await this.cachingService.setCache(
        CacheInfo.LastWEGLDPrice.key,
        pairWithWEGLD.price,
        CacheInfo.LastWEGLDPrice.ttl
      );
      this.clientProxy.emit('refreshCacheKey', CacheInfo.LastWEGLDPrice);
    }

    if (!isWEGLDUSDCPair) {
      const currentWEGLDPrice = await this.maiarDexService.getLastWEGLDPrice(timestamp);

      const pairWithUSDC = new TradingInfoEntity({
        timestamp,
        identifier: event.getDatabaseIdentifier(),
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

  private isInvertedPair(tokenInInfoIdentifier: string, tokenOutInfoIdentifier: string): boolean {
    return tokenInInfoIdentifier === Constants.WrappedEGLD.identifier && tokenOutInfoIdentifier !== Constants.WrappedUSDC.identifier;
  }

  private isWEGLDUSDCPair(tokenInInfoIdentifier: string, tokenOutInfoIdentifier: string): boolean {
    return tokenInInfoIdentifier === Constants.WrappedEGLD.identifier && tokenOutInfoIdentifier === Constants.WrappedUSDC.identifier;
  }

  private isUSDCWEGLDPair(tokenInInfoIdentifier: string, tokenOutInfoIdentifier: string): boolean {
    return tokenInInfoIdentifier === Constants.WrappedUSDC.identifier && tokenOutInfoIdentifier === Constants.WrappedEGLD.identifier;
  }
}
