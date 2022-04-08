import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { MaiarModel } from './models/maiar.model';

@Resolver(() => MaiarModel)
export class MaiarResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => MaiarModel, { name: 'maiar' })
  getBaseModel(): MaiarModel {
    return new MaiarModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'maiar', 'count', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'maiar', 'count_24h', query, aggregates);
  }
}
