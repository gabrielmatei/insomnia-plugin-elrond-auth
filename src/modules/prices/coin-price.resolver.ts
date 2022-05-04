import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { PricesEntity } from "src/common/timescale/entities/prices.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
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
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'current_price', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'market_cap' })
  public async getMarketCap(
    @Parent() { series }: CoinPriceModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'market_cap', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'high_24h' })
  public async getHigh24h(
    @Parent() { series }: CoinPriceModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'high_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'total_volume' })
  public async getTotalVolume(
    @Parent() { series }: CoinPriceModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(PricesEntity, series, 'total_volume', query, aggregates);
  }
}
