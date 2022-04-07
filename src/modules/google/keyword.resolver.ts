import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { GoogleEntity } from "src/common/timescale/entities/google.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
import { QueryInput } from "../models/query.input";
import { KeywordModel } from "./models/keyword.model";

@Resolver(() => KeywordModel)
export class KeywordResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'clicks' })
  public async clicks(
    @Parent() { series }: KeywordModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'clicks', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'impressions' })
  public async impressions(
    @Parent() { series }: KeywordModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'impressions', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'ctr' })
  public async ctr(
    @Parent() { series }: KeywordModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'ctr', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'position' })
  public async position(
    @Parent() { series }: KeywordModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'position', query, aggregates);
  }
}
