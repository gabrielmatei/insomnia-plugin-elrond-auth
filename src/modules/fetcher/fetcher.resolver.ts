import { Resolver, Query, Args, GraphQLISODateTime } from '@nestjs/graphql';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { FetcherService } from './fetcher.service';
import { HistoricalValue, ScalarValue, TimeResolutions } from './models/fetcher.model';

@Resolver(() => String)
export class FetcherResolver {
  constructor(
    private readonly fetcherService: FetcherService
  ) { }

  @Query(() => String)
  async hello() {
    return 'hello';
  }

  @Query(() => ScalarValue, { nullable: true })
  async userAdoptionValue(
    @Args('key', { type: () => String }) key: string = 'count'
  ): Promise<ScalarValue | undefined> {
    const value = await this.fetcherService.getLastValue(AccountsEntity, 'accounts', key);
    return ScalarValue.fromValue(value);
  }

  @Query(() => [HistoricalValue])
  async userAdoptionHistorical(
    @Args('key', { type: () => String }) key: string = 'count',
    @Args('startDate', { type: () => GraphQLISODateTime }) startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime }) endDate: Date,
    @Args('resolution', { type: () => TimeResolutions }) resolution: TimeResolutions,
  ): Promise<HistoricalValue[]> {
    const values = await this.fetcherService.getHistoricalValues(AccountsEntity, 'accounts', key, startDate, endDate, resolution);
    return HistoricalValue.fromValues(values);
  }
}
