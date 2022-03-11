import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TransactionsEntity } from 'src/common/timescale/entities/transactions.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { NftsModel } from './models/nfts.model';

@Resolver(() => NftsModel)
export class NftsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => NftsModel, { name: 'nfts' })
  async getBaseModel(): Promise<NftsModel> {
    return new NftsModel();
  }

  @ResolveField(() => [ScalarValue], { name: 'count' })
  public async count(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'nfts', 'count', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'nfts', 'count_24h', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'active_nfts' })
  public async active_nfts(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'nfts', 'active_nfts', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'transfers' })
  public async transfers(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'nfts', 'transfers', query);
  }
}
