import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingester, IngestItem } from "./entities/ingest";
import {
  AccountsBalanceIngest, AccountsDelegationIngest,
  AccountsDelegationLegacyActiveIngest, AccountsTotalBalanceWithStakeIngest,
  AccountsTotalStakeIngest, EconomicsIngest, ExchangesIngest, GithubIngest,
  GoogleIngest, GoogleTrendsIngest, QuotesIngest, StakingDetailedIngest,
  StakingIngest, TransactionsIngest, TwitterIngest,
} from "./data.ingester.entities";
import { AccountsCountIngest } from "src/ingesters/accounts-count/accounts-count.ingest";
import { AccountsCount } from "src/ingesters/accounts-count/accounts-count.entity";

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
        refreshInterval: CronExpression.EVERY_10_SECONDS,
        tableName: 'accounts_count',
        entityTarget: AccountsCount,
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
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'google',
        fetcher: new GoogleIngest(),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'trends',
        fetcher: new GoogleTrendsIngest(),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'quotes',
        fetcher: new QuotesIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'staking',
        fetcher: new StakingIngest(this.apiConfigService, this.apiService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'staking_historical',
        fetcher: new StakingDetailedIngest(this.apiConfigService, this.apiService, this.gatewayService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'transactions',
        fetcher: new TransactionsIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        tableName: 'twitter',
        fetcher: new TwitterIngest(this.apiConfigService, this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
