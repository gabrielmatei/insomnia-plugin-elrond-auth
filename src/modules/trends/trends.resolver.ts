import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TrendsEntity } from 'src/common/timescale/entities/trends.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { TrendsModel } from './models/trends.model';

@Resolver(() => TrendsModel)
export class TrendsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => TrendsModel, { name: 'trends' })
  getBaseModel(): TrendsModel {
    return new TrendsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'google' })
  public async getGoogleTrends(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TrendsEntity, 'trends', 'google', query);
  }
}
