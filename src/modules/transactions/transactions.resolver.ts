import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TransactionsEntity } from 'src/common/timescale/entities/transactions.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { TransactionsModel } from './models/transactions.model';

@Resolver(() => TransactionsModel)
export class TransactionsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => TransactionsModel, { name: 'transactions' })
  getBaseModel(): TransactionsModel {
    return new TransactionsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'transactions', 'count', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'transactions', 'count_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'value_moved' })
  public async value_moved(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'transactions', 'value_moved', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'total_fees' })
  public async total_fees(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'transactions', 'total_fees', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'new_emission' })
  public async new_emission(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'transactions', 'new_emission', query, aggregates);
  }
}
