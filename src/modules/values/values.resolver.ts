import { Resolver, Query, Args, GraphQLISODateTime } from '@nestjs/graphql';
import { AccountsHistoricalEntity } from 'src/common/timescale/entities/accounts-historical.entity';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ScalarValue, TimeResolutions } from './models/values.model';

@Resolver(() => String)
export class ValuesResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => ScalarValue, { nullable: true })
  async userAdoptionValue(
    @Args('key', { type: () => String }) key: string = 'count'
  ): Promise<ScalarValue | undefined> {
    return await this.timescaleService.getLastValue(AccountsEntity, 'accounts', key);
  }

  @Query(() => [ScalarValue])
  async userAdoptionHistorical(
    @Args('key', { type: () => String }) key: string = 'count',
    @Args('startDate', { type: () => GraphQLISODateTime }) startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime }) endDate: Date,
    @Args('resolution', { type: () => TimeResolutions }) resolution: TimeResolutions,
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.getValues(AccountsHistoricalEntity, 'accounts', key, startDate, endDate, resolution);
  }
}
