import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TradingInfoModel } from './models/trading-info.model';
import { TradingModel } from './models/trading.model';

@Resolver(() => TradingModel)
export class TradingResolver {
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
}
