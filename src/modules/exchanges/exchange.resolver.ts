import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { ExchangesHistoricalEntity } from "src/common/timescale/entities/exchanges-historical.entity";
import { ExchangesEntity } from "src/common/timescale/entities/exchanges.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
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
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'balance', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'total' })
  public async getTotal(
    @Parent() { series }: ExchangeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'total', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'inflows' })
  public async getInflows(
    @Parent() { series }: ExchangeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'inflows', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'outflows' })
  public async getOutflows(
    @Parent() { series }: ExchangeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesHistoricalEntity, series, 'outflows', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'inflow_24h' })
  public async getInflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'inflow_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'outflow_24h' })
  public async getOutflow24h(
    @Parent() { series }: ExchangeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(ExchangesEntity, series, 'outflow_24h', query, aggregates);
  }
}
