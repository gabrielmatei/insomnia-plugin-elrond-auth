import { Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Locker, LockResult } from "src/utils/locker";
import { EntityTarget } from "typeorm";

export interface Ingest {
  name: string;
  entityTarget: EntityTarget<unknown>;
  fetch(): Promise<GenericIngestEntity[]>
}

export class IngestItem {
  refreshInterval!: CronExpression;
  fetcher!: Ingest;
}

export class Ingester {
  public static readonly MAX_RETRIES = 3;

  private readonly logger: Logger;
  private readonly items: IngestItem[];
  private readonly schedulerRegistry: SchedulerRegistry;
  private readonly timescaleService: TimescaleService;

  constructor(items: IngestItem[], schedulerRegistry: SchedulerRegistry, timescaleService: TimescaleService) {
    this.logger = new Logger(Ingester.name);

    this.items = items;
    this.schedulerRegistry = schedulerRegistry;
    this.timescaleService = timescaleService;
  }

  public async start() {
    this.logger.log('Start data ingester');

    const jobs = this.items.map(item => this.scheduleIngestItem(item));
    for (const job of jobs) {
      job.start();
    }
  }

  private scheduleIngestItem(item: IngestItem) {
    const job = new CronJob(item.refreshInterval, async () => {
      await this.fetchRecords(item);
    });

    this.schedulerRegistry.addCronJob(item.fetcher.name, job);

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
        const records = await item.fetcher.fetch();

        await this.timescaleService.writeData(item.fetcher.entityTarget, records);
      }, true);

      retries++;
    }
  }
}
