import { Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Locker, LockResult } from "src/utils/locker";
import { EntityTarget } from "typeorm";

export interface Ingest {
  fetch(): Promise<GenericIngestEntity[]>
}

export class IngestItem {
  name: string = '';
  refreshInterval: CronExpression = CronExpression.EVERY_5_SECONDS;
  entityTarget?: EntityTarget<unknown>;
  fetcher?: Ingest;
}

export class Ingester {
  private readonly logger: Logger;

  private readonly items: IngestItem[];
  private readonly schedulerRegistry: SchedulerRegistry;
  private readonly timescaleService: TimescaleService;

  constructor(items: IngestItem[], schedulerRegistry: SchedulerRegistry, timescaleService: TimescaleService) {
    this.items = items;
    this.schedulerRegistry = schedulerRegistry;
    this.timescaleService = timescaleService;

    this.logger = new Logger(Ingester.name);
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
      if (!item.fetcher) {
        return;
      }

      await this.fetchRecords(item.name, item.entityTarget!, item.fetcher);
    });

    this.schedulerRegistry.addCronJob(item.name, job);

    return job;
  }

  private async fetchRecords(tableName: string, entityTarget: EntityTarget<unknown>, fetcher: Ingest) {
    let result: LockResult = LockResult.error;
    let retries = 0;

    while (result === LockResult.error && retries < 3) {
      if (result === LockResult.error && retries > 0) {
        this.logger.log(`Retry #${retries} for table '${tableName}'`);
      }

      result = await Locker.lock(tableName, async () => {
        const records = await fetcher.fetch();

        await this.timescaleService.writeData(entityTarget, records);
      }, true);

      retries++;
    }
  }
}
