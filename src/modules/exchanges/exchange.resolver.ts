import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { ExchangesHistoricalEntity } from "src/common/timescale/entities/exchanges-historical.entity";
import { ExchangesEntity } from "src/common/timescale/entities/exchanges.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { ExchangeModel } from "./models/exchange.model";

@Resolver(() => ExchangeModel)
export class ExchangeResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'balance' })
  public async getBalance(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'balance', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'total' })
  public async getTotal(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'total', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'inflows' })
  public async getInflows(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'inflows', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'outflows' })
  public async getOutflows(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'outflows', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'inflow_24h' })
  public async getInflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'inflow_24h', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'outflow_24h' })
  public async getOutflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'outflow_24h', query);
  }
}
