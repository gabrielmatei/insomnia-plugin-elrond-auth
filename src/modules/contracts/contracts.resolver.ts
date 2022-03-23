import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
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

  @ResolveField(() => [ScalarValue], { name: 'count' })
  public async count(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'contracts', 'count_24h', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'active_contracts' })
  public async active_contracts(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'active_contracts', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'transfers' })
  public async transfers(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'contracts', 'transfers', query);
  }
}
