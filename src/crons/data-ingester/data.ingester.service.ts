import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AccountsIngest } from "./entities/accounts.ingest";
import { EconomicsIngest } from "./entities/economics.ingest";
import { Ingester, IngestItem } from "./entities/ingest";

@Injectable()
export class DataIngesterService {
  private readonly ingester: Ingester;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly timescaleService: TimescaleService,
    private readonly elasticService: ElasticService,
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) {
    const items: IngestItem[] = [
      {
        refreshInterval: CronExpression.EVERY_MINUTE,
        tableName: 'accounts',
        fetcher: new AccountsIngest(this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_MINUTE,
        tableName: 'economics',
        fetcher: new EconomicsIngest(this.apiConfigService, this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
