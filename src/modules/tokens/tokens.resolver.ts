import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
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
  async getBaseModel(): Promise<TokensModel> {
    return new TokensModel();
  }

  @ResolveField(() => [ScalarValue], { name: 'count' })
  public async count(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'tokens', 'count', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'tokens', 'count_24h', query);
  }
}
