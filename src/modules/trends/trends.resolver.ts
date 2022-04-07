import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TrendsEntity } from 'src/common/timescale/entities/trends.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
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
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TrendsEntity, 'trends', 'google', query, aggregates);
  }
}
