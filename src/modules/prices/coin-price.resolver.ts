import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { PricesEntity } from "src/common/timescale/entities/prices.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { CoinPriceModel } from "./models/coin-price.model";

@Resolver(() => CoinPriceModel)
export class CoinPriceResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'current_price' })
  public async getCurrentPrice(
    @Parent() { series }: CoinPriceModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'current_price', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'market_cap' })
  public async getMarketCap(
    @Parent() { series }: CoinPriceModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'market_cap', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'high_24h' })
  public async getHigh24h(
    @Parent() { series }: CoinPriceModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'high_24h', query);
  }
}
