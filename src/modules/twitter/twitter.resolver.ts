import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TwitterEntity } from 'src/common/timescale/entities/twitter.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { TwitterModel } from './models/twitter.model';

@Resolver(() => TwitterModel)
export class TwitterResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => TwitterModel, { name: 'twitter' })
  getBaseModel(): TwitterModel {
    return new TwitterModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'mentions' })
  public async getMentions(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TwitterEntity, 'twitter', 'mentions', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'followers' })
  public async getFollowers(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TwitterEntity, 'twitter', 'followers', query, aggregates);
  }
}
