import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AccountsCountIngest } from "src/ingesters/accounts-count/accounts-count.ingest";
import { AccountsCount } from "src/ingesters/accounts-count/accounts-count.entity";
import { AccountsBalanceIngest } from "src/ingesters/accounts-balance/accounts-balance.ingest";
import { AccountsBalance } from "src/ingesters/accounts-balance/accounts-balance.entity";
import { Economics } from "src/ingesters/economics/economics.entity";
import { EconomicsIngest } from "src/ingesters/economics/economics.ingest";
import { Ingester, IngestItem } from "./ingester";
import { AccountsDelegationLegacyActiveIngest } from "src/ingesters/accounts-delegation-legacy-active.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "src/ingesters/accounts-total-balance-with-stake.ingest";
import { AccountsTotalStakeIngest } from "src/ingesters/accounts-total-stake.ingest";
import { ExchangesIngest } from "src/ingesters/exchanges.ingest";
import { GithubIngest } from "src/ingesters/github.ingest";
import { GoogleIngest } from "src/ingesters/google.ingest";
import { GoogleTrendsIngest } from "src/ingesters/google-trends.ingest";
import { QuotesIngest } from "src/ingesters/quotes.ingest";
import { StakingIngest } from "src/ingesters/staking.ingest";
import { StakingDetailedIngest } from "src/ingesters/staking-detailed.ingest";
import { TwitterIngest } from "src/ingesters/twitter.ingest";
import { Transactions } from "src/ingesters/transactions/transactions.entity";
import { TransactionsIngest } from "src/ingesters/transactions/transactions.ingest";
import { AccountsDelegation } from "src/ingesters/accounts-delegation/accounts-delegation.entity";
import { AccountsDelegationIngest } from "src/ingesters/accounts-delegation/accounts-delegation.ingest";

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
        name: 'accounts_count',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: AccountsCount,
        fetcher: new AccountsCountIngest(this.apiConfigService, this.elasticService),
      },
      {
        name: 'accounts_balance',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: AccountsBalance,
        fetcher: new AccountsBalanceIngest(this.apiConfigService, this.elasticService),
      },
      {
        name: 'accounts_delegation',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: AccountsDelegation,
        fetcher: new AccountsDelegationIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'accounts_delegation_legacy_active',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsDelegationLegacyActiveIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'accounts_total_balance_with_stake',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsTotalBalanceWithStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'accounts_total_stake',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsTotalStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'economics',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Economics,
        fetcher: new EconomicsIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'exchanges',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new ExchangesIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'github',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GithubIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'google',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GoogleIngest(),
      },
      {
        name: 'trends',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GoogleTrendsIngest(),
      },
      {
        name: 'quotes',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new QuotesIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'staking',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new StakingIngest(this.apiConfigService, this.apiService, this.gatewayService),
      },
      {
        name: 'staking_historical',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new StakingDetailedIngest(this.apiConfigService, this.apiService, this.gatewayService, this.elasticService),
      },
      {
        name: 'transactions',
        entityTarget: Transactions,
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new TransactionsIngest(this.apiConfigService, this.elasticService),
      },
      {
        name: 'twitter',
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new TwitterIngest(this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
