import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
import { TwitterEntity } from 'src/common/timescale/entities/twitter.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { TwitterModel } from './models/twitter.model';

@Resolver(() => TwitterModel)
export class TwitterResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => TwitterModel, { name: 'twitter' })
  async getTwitter(): Promise<TwitterModel> {
    return new TwitterModel();
  }

  @ResolveField(() => [ScalarValue], { name: 'mentions' })
  public async getMentions(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TwitterEntity, 'twitter', 'mentions', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'followers' })
  public async getFollowers(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TwitterEntity, 'twitter', 'followers', query);
  }
}
