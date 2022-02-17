import { Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import moment from "moment";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Constants } from "src/utils/constants";
import { Locker } from "src/utils/locker";

export interface Ingest {
  fetch(): Promise<Record<string, number>>
}

export class IngestItem {
  refreshInterval: CronExpression = CronExpression.EVERY_5_SECONDS;
  tableName: string = '';
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

      await this.fetchRecords(item.tableName, item.fetcher);
    });

    this.schedulerRegistry.addCronJob(item.tableName, job);

    return job;
  }

  private async fetchRecords(tableName: string, fetcher: Ingest) {
    await Locker.lock(tableName, async () => {
      const currentTime = moment().utc().format(Constants.sqlDateFormat());

      const records = await fetcher.fetch();

      // write records
      await Promise.all(
        Object
          .entries(records)
          .map(async ([key, value]) => await this.timescaleService.writeData(tableName, key, value, currentTime))
      );
    }, true);
  }
}
