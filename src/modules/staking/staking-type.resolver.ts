import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { StakingHistoricalEntity } from "src/common/timescale/entities/staking-historical.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { StakingTypeModel } from "./models/staking-type.model";

@Resolver(() => StakingTypeModel)
export class StakingTypeResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'value' })
  public async value(
    @Parent() { series }: StakingTypeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'value', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'users' })
  public async users(
    @Parent() { series }: StakingTypeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'users', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'user_average' })
  public async user_average(
    @Parent() { series }: StakingTypeModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(StakingHistoricalEntity, series, 'user_average', query);
  }
}
