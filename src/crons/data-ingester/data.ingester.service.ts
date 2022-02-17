import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AccountsIngest } from "./entities/accounts.ingest";
import { Ingester, IngestItem } from "./entities/ingest";

@Injectable()
export class DataIngesterService {
  private readonly ingester: Ingester;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timescaleService: TimescaleService
  ) {
    const items: IngestItem[] = [
      {
        refreshInterval: CronExpression.EVERY_5_SECONDS,
        tableName: 'test_hyper',
        fetcher: new AccountsIngest(),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
