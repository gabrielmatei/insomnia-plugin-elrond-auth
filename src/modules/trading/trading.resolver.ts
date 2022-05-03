import { Inject } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { BlockModel } from './models/block.model';
import { TradingInfoModel } from './models/trading-info.model';
import { TradingModel } from './models/trading.model';
import { PUB_SUB } from '../redis.pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { TradingCandlestickModel } from './models/trading-candlestick.model';
import { TradingService } from 'src/common/trading/trading.service';

@Resolver(() => TradingModel)
export class TradingResolver {
  constructor(
    private readonly tradingService: TradingService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) { }

  @Query(() => TradingModel, { name: 'trading' })
  getBaseModel(): TradingModel {
    return new TradingModel();
  }

  @ResolveField(() => TradingInfoModel, { name: 'pair' })
  pair(
    @Args({ name: 'first_token', type: () => String }) firstToken: string,
    @Args({ name: 'second_token', type: () => String }) secondToken: string
  ): TradingInfoModel {
    return new TradingInfoModel(firstToken, secondToken);
  }

  @ResolveField(() => [TradingCandlestickModel], { name: 'candlestick' })
  async candlestick(
    @Args({ name: 'first_token', type: () => String }) firstToken: string,
    @Args({ name: 'second_token', type: () => String }) secondToken: string,
    @Args({ name: 'to', type: () => Number }) to: number,
    @Args({ name: 'resolution', description: 'in seconds', type: () => Number }) resolution: number,
    @Args({ name: 'from', type: () => Number, nullable: true }) from?: number,
  ): Promise<TradingCandlestickModel[]> {
    return await this.tradingService.resolveCandlestickQuery(firstToken, secondToken, from, to, resolution);
  }

  @Subscription(() => BlockModel)
  newBlock() {
    return this.pubSub.asyncIterator('newBlock');
  }
}
