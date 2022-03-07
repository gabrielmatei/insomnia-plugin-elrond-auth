import { Resolver, Query, Args } from '@nestjs/graphql';
import { AccountsHistoricalEntity } from 'src/common/timescale/entities/accounts-historical.entity';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { HistoricalInput, ScalarValue } from './models/values.model';

@Resolver(() => String)
export class ValuesResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => ScalarValue, { nullable: true })
  async userAdoptionValue(@Args('key', { nullable: true }) key: string = 'count'): Promise<ScalarValue | undefined> {
    return await this.timescaleService.getLastValue(AccountsEntity, 'accounts', key);
  }

  @Query(() => [ScalarValue])
  async userAdoptionHistorical(@Args('options') options: HistoricalInput): Promise<ScalarValue[]> {
    return await this.timescaleService.getValues(
      AccountsHistoricalEntity, 'accounts',
      options.key,
      options.startDate,
      options.endDate,
      options.resolution
    );
  }
}
