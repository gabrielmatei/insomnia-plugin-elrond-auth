import { Injectable } from '@nestjs/common';
import { GenericIngestEntity } from 'src/common/timescale/entities/generic-ingest.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { EntityTarget } from 'typeorm';

@Injectable()
export class FetcherService {
  constructor(
    private readonly timescaleService: TimescaleService,
  ) { }

  public async getLastValue<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, series: string, key: string): Promise<number | undefined> {
    // const lastValues = await this.timescaleService.getLastValue(entityTarget, series);
    // if (lastValues.length === 0) {
    //     return undefined;
    // }

    // const object: any = {};
    // for (const value of lastValues) {
    //     object[value.key] = value.value;
    // }
    // return object;

    const lastValue = await this.timescaleService.getLastValue(entityTarget, series, key);
    return lastValue;
  }

  public async getHistoricalValues<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, series: string, key: string, startDate: Date, endDate: Date, resolution: string) {
    const a = await this.timescaleService.getValues(entityTarget, series, key, startDate, endDate, resolution);
    return a;
  }
}
