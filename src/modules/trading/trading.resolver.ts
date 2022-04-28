import { Inject } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { BlockModel } from './models/block.model';
import { TradingInfoModel } from './models/trading-info.model';
import { TradingModel } from './models/trading.model';
import { PUB_SUB } from '../redis.pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => TradingModel)
export class TradingResolver {
  constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) { }

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

  @Subscription(() => BlockModel)
  newBlock() {
    return this.pubSub.asyncIterator('newBlock');
  }
}
