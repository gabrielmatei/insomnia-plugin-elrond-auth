import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { StakingHistoricalEntity } from "src/common/timescale/entities/staking-historical.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
import { QueryInput } from "../models/query.input";
import { StakingTypeModel } from "./models/staking-type.model";

@Resolver(() => StakingTypeModel)
export class StakingTypeResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'value' })
  public async value(
    @Parent() { series }: StakingTypeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'value', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'users' })
  public async users(
    @Parent() { series }: StakingTypeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'users', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'user_average' })
  public async user_average(
    @Parent() { series }: StakingTypeModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'user_average', query, aggregates);
  }
}
