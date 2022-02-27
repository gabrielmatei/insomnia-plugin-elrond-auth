import { Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Locker } from "src/utils/locker";
import { EntityTarget } from "typeorm";

export interface Ingest {
  fetch(): Promise<GenericIngestEntity[]>
}

export class IngestItem {
  refreshInterval: CronExpression = CronExpression.EVERY_5_SECONDS;
  tableName: string = '';
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

      await this.fetchRecords(item.tableName, item.entityTarget!, item.fetcher);
    });

    this.schedulerRegistry.addCronJob(item.tableName, job);

    return job;
  }

  private async fetchRecords(tableName: string, entityTarget: EntityTarget<unknown>, fetcher: Ingest) {
    await Locker.lock(tableName, async () => {
      const records = await fetcher.fetch();

      await Promise.all(records.map(async (record) => {
        await this.timescaleService.writeData(entityTarget, record);
      }));
    }, true);
  }
}
