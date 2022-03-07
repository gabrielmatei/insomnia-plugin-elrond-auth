import { Resolver, Query, Args } from '@nestjs/graphql';
import { HistoricalInput } from 'src/common/entities/historical.input';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
import { AccountsHistoricalEntity } from 'src/common/timescale/entities/accounts-historical.entity';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';

@Resolver(() => String)
export class AccountsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => ScalarValue, { nullable: true })
  async userAdoptionValue(@Args('key', { nullable: true }) key: string = 'count'): Promise<ScalarValue | undefined> {
    return await this.timescaleService.getLastValue(AccountsEntity, 'accounts', key);
  }

  @Query(() => [ScalarValue])
  async userAdoptionHistorical(@Args('input') input: HistoricalInput): Promise<ScalarValue[]> {
    return await this.timescaleService.getValues(
      AccountsHistoricalEntity,
      'accounts',
      input.key,
      input.startDate,
      input.endDate,
      input.resolution
    );
  }
}
