import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TransactionsEntity } from 'src/common/timescale/entities/transactions.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { TokensModel } from './models/tokens.model';

@Resolver(() => TokensModel)
export class TokensResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => TokensModel, { name: 'tokens' })
  getBaseModel(): TokensModel {
    return new TokensModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'tokens', 'count', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'tokens', 'count_24h', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'active_tokens' })
  public async active_tokens(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'tokens', 'active_tokens', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'transfers' })
  public async transfers(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'tokens', 'transfers', query);
  }
}
