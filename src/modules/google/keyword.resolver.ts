import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { GoogleEntity } from "src/common/timescale/entities/google.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
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
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'clicks', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'impressions' })
  public async impressions(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'impressions', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'ctr' })
  public async ctr(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'ctr', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'position' })
  public async position(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'position', query);
  }
}
