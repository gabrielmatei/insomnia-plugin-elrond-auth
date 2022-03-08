import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { PricesEntity } from "src/common/timescale/entities/prices.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { CoinModel } from "./models/coin.model";

@Resolver(() => CoinModel)
export class CoinResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'current_price' })
  public async getCurrentPrice(@Parent() { series }: CoinModel, @Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'current_price', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'market_cap' })
  public async getMarketCap(@Parent() { series }: CoinModel, @Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'market_cap', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'high_24h' })
  public async getHigh24h(@Parent() { series }: CoinModel, @Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'high_24h', query);
  }
}
