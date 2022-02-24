import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AccountsBalanceIngest } from "./entities/accounts-balance.ingest";
import { AccountsCountIngest } from "./entities/accounts-count.ingest";
import { AccountsDelegationLegacyActiveIngest } from "./entities/accounts-delegation-legacy-active.ingest";
import { AccountsDelegationIngest } from "./entities/accounts-delegation.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "./entities/accounts-total-balance-with-stake.ingest";
import { AccountsTotalStakeIngest } from "./entities/accounts-total-stake.ingest";
import { EconomicsIngest } from "./entities/economics.ingest";
import { ExchangesIngest } from "./entities/exchanges.ingest";
import { GithubIngest } from "./entities/github.ingest";
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
    private readonly gatewayService: GatewayService,
  ) {
    const items: IngestItem[] = [
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_count',
        fetcher: new AccountsCountIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_balance',
        fetcher: new AccountsBalanceIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_delegation',
        fetcher: new AccountsDelegationIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_delegation_legacy_active',
        fetcher: new AccountsDelegationLegacyActiveIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_total_balance_with_stake',
        fetcher: new AccountsTotalBalanceWithStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'accounts_total_stake',
        fetcher: new AccountsTotalStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'economics',
        fetcher: new EconomicsIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'exchanges',
        fetcher: new ExchangesIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'github',
        fetcher: new GithubIngest(this.apiConfigService, this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
