import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
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

  @ResolveField(() => [ScalarValue], { name: 'google' })
  public async getGoogleTrends(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TrendsEntity, 'trends', 'google', query);
  }
}
