import { Injectable } from '@nestjs/common';
import { Pair } from 'src/common/maiar-dex/entities/pair';
import { MaiarDexService } from 'src/common/maiar-dex/maiar-dex.service';
import { MaiarDexEntity } from 'src/common/timescale/entities/maiar-dex.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { AggregateEnum } from '../models/aggregate.enum';
import { MaiarDexPoolSimpleModel } from './models/maiar-dex-pool-simple.model';
import { MaiarDexPoolModel } from './models/maiar-dex-pool.model';
import { MaiarDexWeeklyReportModel } from './models/maiar-dex-weekly-report.model';

@Injectable()
export class MaiarDexResolverService {
  constructor(
    private readonly timescaleService: TimescaleService,
    private readonly maiarDexService: MaiarDexService
  ) { }

  public async getAllPools(): Promise<MaiarDexPoolModel[]> {
    const pairs = await this.maiarDexService.getAllPairs();
    const pairSymbols = pairs.map(pair => Pair.getSymbol(pair));

    const pools = pairSymbols.map(pair => new MaiarDexPoolModel(pair));
    return pools;
  }

  public async getWeeklyReport(): Promise<MaiarDexWeeklyReportModel> {
    const [
      totalValueLockedQueryResult,
      totalVolumeQueryResult,
      mexBurntQueryResult,
      poolsRaw,
    ] = await Promise.all([
      this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'total_value_locked', undefined, [AggregateEnum.LAST]),
      this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'volume', undefined, [AggregateEnum.LAST]),
      this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'mex_burnt', undefined, [AggregateEnum.LAST]),
      this.getAllPools(),
    ]);

    const pools = await Promise.all(poolsRaw
      .map(async (poolRaw) => {
        const volumeQueryResult = await this.timescaleService.resolveQuery(MaiarDexEntity, poolRaw.name, 'volume', undefined, [AggregateEnum.LAST]);
        return new MaiarDexPoolSimpleModel({
          name: poolRaw.name,
          volume: volumeQueryResult[0]?.last,
        });
      }));

    const sortedPools = pools.sortedDescending(pool => pool.volume ?? 0);

    const weeklyReport = new MaiarDexWeeklyReportModel({
      total_value_locked: totalValueLockedQueryResult[0]?.last,
      total_volume: totalVolumeQueryResult[0]?.last,
      mex_burnt: mexBurntQueryResult[0]?.last,
      volume_pools: sortedPools,
    });
    return weeklyReport;
  }
}
