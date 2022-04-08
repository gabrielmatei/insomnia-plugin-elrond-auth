import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { ContractsModel } from './models/contracts.model';

@Resolver(() => ContractsModel)
export class ContractsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => ContractsModel, { name: 'contracts' })
  getBaseModel(): ContractsModel {
    return new ContractsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'active_contracts' })
  public async active_contracts(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'active_contracts', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'transfers' })
  public async transfers(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'transfers', query, aggregates);
  }
}
