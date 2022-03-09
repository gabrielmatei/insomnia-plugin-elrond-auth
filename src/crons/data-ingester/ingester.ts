import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { MetricsService } from "src/common/metrics/metrics.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Locker, LockResult } from "src/utils/locker";
import { IngestItem } from "./entities/ingest.item";

@Injectable()
export class Ingester {
  public static readonly MAX_RETRIES = 3;

  private readonly logger: Logger;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timescaleService: TimescaleService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger = new Logger(Ingester.name);
  }

  public async start(items: IngestItem[]) {
    this.logger.log('Start data ingester');

    const jobs = items.map(item => this.scheduleIngestItem(item));
    for (const job of jobs) {
      job.start();
    }
  }

  private scheduleIngestItem(item: IngestItem) {
    const job = new CronJob(item.refreshInterval, async () => {
      await this.fetchRecords(item);
    });

    this.schedulerRegistry.addCronJob(item.fetcher.name, job);

    this.logger.log(`Created job for '${item.fetcher.name}' with cron '${item.refreshInterval}'`);

    return job;
  }

  private async fetchRecords(item: IngestItem) {
    let result: LockResult = LockResult.error;
    let retries = 0;

    while (result === LockResult.error && retries < Ingester.MAX_RETRIES) {
      if (result === LockResult.error && retries > 0) {
        this.logger.log(`Retry #${retries} for fetcher '${item.fetcher.name}'`);
      }

      result = await Locker.lock(item.fetcher.name, async () => {
        const fetchResponse = await item.fetcher.fetch();

        if (fetchResponse.current) {
          await this.timescaleService.writeData(fetchResponse.current.entity, fetchResponse.current.records);
        }
        if (fetchResponse.historical) {
          await this.timescaleService.writeData(fetchResponse.historical.entity, fetchResponse.historical.records);
        }
        if (fetchResponse.backup) {
          await this.timescaleService.writeData(fetchResponse.backup.entity, fetchResponse.backup.records);
        }
      }, true);

      retries++;
    }

    if (result === LockResult.error) {
      this.metricsService.setFetcherAlert(item.fetcher.name);
    }
  }
}
