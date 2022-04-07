import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { StakingHistoricalEntity } from "src/common/timescale/entities/staking-historical.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
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
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'value', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'users' })
  public async users(
    @Parent() { series }: StakingTypeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'users', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'user_average' })
  public async user_average(
    @Parent() { series }: StakingTypeModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'user_average', query);
  }
}
