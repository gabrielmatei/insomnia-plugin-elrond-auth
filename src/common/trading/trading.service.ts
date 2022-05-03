import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import moment from "moment";
import { AggregateEnum } from "src/modules/models/aggregate.enum";
import { QueryInput } from "src/modules/models/query.input";
import { TradeModel } from "src/modules/trading/models/trade.model";
import { TradingCandlestickModel } from "src/modules/trading/models/trading-candlestick.model";
import { Constants } from "src/utils/constants";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { AggregateValue } from "../entities/aggregate-value.object";
import { MaiarDexService } from "../maiar-dex/maiar-dex.service";
import { Block } from "../rabbitmq/entities/block";
import { SwapFixedInputEvent } from "../rabbitmq/entities/pair/swap-fixed-input.event";
import { SwapFixedOutputEvent } from "../rabbitmq/entities/pair/swap-fixed-output.event";
import { TradingInfoEntity } from "../timescale/entities/trading-info.entity";
import { TimescaleService } from "../timescale/timescale.service";

@Injectable()
export class TradingService {
  private readonly logger: Logger;

  constructor(
    private readonly cachingService: CachingService,
    private readonly maiarDexService: MaiarDexService,
    private readonly timescaleService: TimescaleService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  ) {
    this.logger = new Logger(TradingService.name);
  }

  public async indexEvent(event: SwapFixedInputEvent | SwapFixedOutputEvent, block?: Block): Promise<TradingInfoEntity[]> {
    const swapPair = await this.maiarDexService.getPair(event.getAddress());
    if (!swapPair) {
      this.logger.error(`Could not find pair address for swap event: ${JSON.stringify(event.toJSON())}`);
      return [];
    }

    const tokenInIdentifier = event.getTokenIn().tokenID;
    const tokenOutIdentifier = event.getTokenOut().tokenID;

    const tokenIn = await this.maiarDexService.getToken(tokenInIdentifier);
    const tokenOut = await this.maiarDexService.getToken(tokenOutIdentifier);

    if (tokenIn === undefined || tokenOut === undefined) {
      this.logger.error(`Could not fetch tokens for swap event: ${JSON.stringify(event.toJSON())}`);
      return [];
    }

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

    const timestamp = moment
      .unix(block !== undefined
        ? block.timestamp
        : event.getTimestamp().toNumber())
      .toDate();
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

    this.checkTrades(trades);

    return trades;
  }

  public async writeTrades(trades: TradingInfoEntity[]) {
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

  private checkTrades(trades: TradingInfoEntity[]): void {
    for (const trade of trades) {
      if (trade.firstToken === '') {
        this.logger.warn(`Detected empty 'firstToken' on trade with identifier '${trade.identifier}'`);
      }
      if (trade.secondToken === '') {
        this.logger.warn(`Detected empty 'secondToken' on trade with identifier '${trade.identifier}'`);
      }
      if (trade.price === 0 || trade.price < 0) {
        this.logger.warn(`Detected zero or negative price on trade with identifier '${trade.identifier}'`);
      }
      if (trade.volume === 0 || trade.volume < 0) {
        this.logger.warn(`Detected zero or negative volume on trade with identifier '${trade.identifier}'`);
      }
      if (trade.fee === 0 || trade.fee < 0) {
        this.logger.warn(`Detected zero or negative fee on trade with identifier '${trade.identifier}'`);
      }
    }
  }

  public async resolveTradingQuery(
    firstToken: string,
    secondToken: string,
    series: string,
    query: QueryInput,
    aggregates: AggregateEnum[]
  ): Promise<AggregateValue[]> {
    const pair = await this.maiarDexService.getPairByTokens(firstToken, secondToken);
    if (!pair) {
      throw new BadRequestException(`Pair with '${firstToken}' and '${secondToken}' is not supported`);
    }

    return await this.timescaleService.resolveTradingQuery(firstToken, secondToken, series, query, aggregates);
  }

  public async resolveCandlestickQuery(
    firstToken: string,
    secondToken: string,
    from: number | undefined,
    to: number,
    resolution: number
  ): Promise<TradingCandlestickModel[]> {
    const pair = await this.maiarDexService.getPairByTokens(firstToken, secondToken);
    if (!pair) {
      throw new BadRequestException(`Pair with '${firstToken}' and '${secondToken}' is not supported`);
    }

    if (from === undefined) {
      return await this.timescaleService.getLastCandlestickWithResolution(firstToken, secondToken, to, resolution);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return await this.timescaleService.getCandlesticks(firstToken, secondToken, from!, to, resolution);
  }

  public async getLastTrade(firstToken: string, secondToken: string, to: number): Promise<TradeModel | undefined> {
    const lte = moment.unix(to).toDate();
    const tradeEntity = await this.timescaleService.getLastTrade(firstToken, secondToken, lte);
    if (!tradeEntity) {
      return undefined;
    }

    return TradeModel.fromEntity(tradeEntity);
  }
}
