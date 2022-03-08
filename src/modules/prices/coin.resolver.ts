import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { PricesEntity } from "src/common/timescale/entities/prices.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AggregateEnum } from "../models/aggregate.enum";
import { CoinModel } from "./models/coin.model";

@Resolver(() => CoinModel)
export class CoinResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'current_price' })
  public async getCurrentPrice(
    @Parent() { series }: CoinModel,
    @Args({ name: 'aggregate', type: () => AggregateEnum }) aggregate: AggregateEnum,
  ): Promise<ScalarValue[]> {
    return await this.getLastValue(series, 'current_price', aggregate);
  }

  @ResolveField(() => [ScalarValue], { name: 'market_cap' })
  public async getMarketCap(
    @Parent() { series }: CoinModel,
    @Args({ name: 'aggregate', type: () => AggregateEnum }) aggregate: AggregateEnum,
  ): Promise<ScalarValue[]> {
    return await this.getLastValue(series, 'market_cap', aggregate);
  }

  @ResolveField(() => [ScalarValue], { name: 'high_24h' })
  public async getHigh24h(
    @Parent() { series }: CoinModel,
    @Args({ name: 'aggregate', type: () => AggregateEnum }) aggregate: AggregateEnum,
  ): Promise<ScalarValue[]> {
    return await this.getLastValue(series, 'high_24h', aggregate);
  }

  private async getLastValue(series: string, key: string, aggregate: AggregateEnum) {
    switch (aggregate) {
      case AggregateEnum.LAST:
        const lastValue = await this.timescaleService.getLastValue(PricesEntity, series, key);
        if (!lastValue) {
          return [];
        }
        return [lastValue];
      default:
        return [];
    }
  }
}
