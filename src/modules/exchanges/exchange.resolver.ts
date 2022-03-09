import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
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

  @ResolveField(() => [ScalarValue], { name: 'balance' })
  public async getBalance(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'balance', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'total' })
  public async getTotal(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'total', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'inflows' })
  public async getInflows(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'inflows', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'outflows' })
  public async getOutflows(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'outflows', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'inflow_24h' })
  public async getInflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'inflow_24h', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'outflow_24h' })
  public async getOutflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'outflow_24h', query);
  }
}
