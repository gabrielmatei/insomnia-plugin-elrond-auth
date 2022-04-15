import { ResolveField, Resolver } from '@nestjs/graphql';
import { MaiarDexEntity } from 'src/common/timescale/entities/maiar-dex.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { MaiarDexWeeklyReportModel } from './models/maiar-dex-weekly-report.model';

@Resolver(() => MaiarDexWeeklyReportModel)
export class MaiarDexWeeklyReportResolver {
  constructor(
    private readonly timescaleService: TimescaleService,
  ) { }

  @ResolveField(() => Number, { name: 'total_value_locked' })
  public async total_value_locked(): Promise<number | undefined> {
    const queryResult = await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'total_value_locked', new QueryInput(), [AggregateEnum.LAST]);
    if (queryResult.length === 0) {
      return undefined;
    }

    const value = queryResult[0].last;
    return value;
  }
}
