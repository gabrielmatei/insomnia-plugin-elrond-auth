import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { Pair } from "src/common/maiar-dex/entities/pair";
import { MaiarDexService } from "src/common/maiar-dex/maiar-dex.service";
import { MaiarDexEntity } from "src/common/timescale/entities/maiar-dex.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";

@Injectable()
export class MaiarDexIngest implements Ingest {
  public readonly name = MaiarDexIngest.name;
  public readonly entityTarget = MaiarDexEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly maiarDexService: MaiarDexService,
  ) { }

  public async fetch(): Promise<IngestRecords[]> {
    const ingestDate = moment.utc().startOf('day').toDate();

    const startDate = moment.utc().subtract(7, 'days').startOf('day').toDate();
    const endDate = moment.utc().subtract(1, 'day').endOf('day').toDate();

    const mexIdentifier = this.apiConfigService.getMexIdentifier();

    const [
      totalValueLocked,
      totalVolume,
      mexBurnt,
    ] = await Promise.all([
      this.maiarDexService.getTotalValueLocked(),
      this.maiarDexService.getTotalVolume(startDate, endDate),
      this.maiarDexService.getTokenBurntVolume(mexIdentifier, startDate, endDate),
    ]);

    const data: any = {
      dashboard: {
        total_value_locked: totalValueLocked,
        volume: totalVolume,
        mex_burnt: mexBurnt,
      },
    };

    const pools = await this.maiarDexService.getPools(startDate, endDate);
    for (const pool of pools) {
      const symbol = Pair.getSymbol(pool.pair);
      data[symbol] = {
        volume: pool.volume,
      };
    }

    return [{
      entity: MaiarDexEntity,
      records: MaiarDexEntity.fromObject(ingestDate, data),
    }];
  }
}
