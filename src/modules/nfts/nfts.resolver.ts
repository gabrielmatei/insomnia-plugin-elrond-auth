import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TransactionsDetailedEntity } from 'src/common/timescale/entities/transactions-detailed.entity';
import { TransactionsEntity } from 'src/common/timescale/entities/transactions.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { NftsModel } from './models/nfts.model';

@Resolver(() => NftsModel)
export class NftsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => NftsModel, { name: 'nfts' })
  getBaseModel(): NftsModel {
    return new NftsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'nfts', 'count', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsEntity, 'nfts', 'count_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'active_nfts' })
  public async active_nfts(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'nfts', 'active_nfts', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'transfers' })
  public async transfers(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'nfts', 'transfers', query, aggregates);
  }
}
