import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { GithubActivityEntity } from "src/common/timescale/entities/github-activity.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { GithubActivityModel } from "./models/github-activity.model";

@Resolver(() => GithubActivityModel)
export class GithubActivityResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'commits' })
  public async commits(
    @Parent() { series }: GithubActivityModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GithubActivityEntity, series, 'commits', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'commits_24h' })
  public async commits_24h(
    @Parent() { series }: GithubActivityModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GithubActivityEntity, series, 'commits_24h', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'contributors' })
  public async contributors(
    @Parent() { series }: GithubActivityModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GithubActivityEntity, series, 'contributors', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'stars' })
  public async stars(
    @Parent() { series }: GithubActivityModel,
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(GithubActivityEntity, series, 'stars', query);
  }
}
