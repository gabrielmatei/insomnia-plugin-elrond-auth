import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
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
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count_24h', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'active_contracts' })
  public async active_contracts(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'active_contracts', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'transfers' })
  public async transfers(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'transfers', query);
  }
}
