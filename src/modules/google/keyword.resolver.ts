import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { GoogleEntity } from "src/common/timescale/entities/google.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { KeywordModel } from "./models/keyword.model";

@Resolver(() => KeywordModel)
export class KeywordResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'clicks' })
  public async clicks(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'clicks', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'impressions' })
  public async impressions(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'impressions', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'ctr' })
  public async ctr(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'ctr', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'position' })
  public async position(
    @Parent() { series }: KeywordModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(GoogleEntity, series, 'position', query);
  }
}
