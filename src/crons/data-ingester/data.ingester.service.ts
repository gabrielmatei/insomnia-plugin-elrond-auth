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
import { Transactions } from "src/ingesters/transactions/transactions.entity";
import { TransactionsIngest } from "src/ingesters/transactions/transactions.ingest";
import { AccountsDelegation } from "src/ingesters/accounts-delegation/accounts-delegation.entity";
import { AccountsDelegationIngest } from "src/ingesters/accounts-delegation/accounts-delegation.ingest";
import { AccountsTotalStake } from "src/ingesters/accounts-total-stake/accounts-total-stake.entity";
import { AccountsTotalStakeIngest } from "src/ingesters/accounts-total-stake/accounts-total-stake.ingest";
import { AccountsDelegationLegacyActive } from "src/ingesters/accounts-delegation-legacy-active/accounts-delegation-legacy-active.entity";
import { AccountsDelegationLegacyActiveIngest } from "src/ingesters/accounts-delegation-legacy-active/accounts-delegation-legacy-active.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "src/ingesters/accounts-total-balance-with-stake/accounts-total-balance-with-stake.ingest";
import { AccountsTotalBalanceWithStake } from "src/ingesters/accounts-total-balance-with-stake/accounts-total-balance-with-stake.entity";
import { Exchanges } from "src/ingesters/exchanges/exchanges.entity";
import { ExchangesIngest } from "src/ingesters/exchanges/exchanges.ingest";
import { GithubIngest } from "src/ingesters/github/github.ingest";
import { Github } from "src/ingesters/github/github.entity";
import { Google } from "src/ingesters/google/google.entity";
import { GoogleIngest } from "src/ingesters/google/google.ingest";
import { GoogleTrends } from "src/ingesters/google-trends/google-trends.entity";
import { GoogleTrendsIngest } from "src/ingesters/google-trends/google-trends.ingest";
import { Staking } from "src/ingesters/staking/staking.entity";
import { StakingDetailed } from "src/ingesters/staking-detailed/staking-detailed.entity";
import { StakingIngest } from "src/ingesters/staking/staking.ingest";
import { StakingDetailedIngest } from "src/ingesters/staking-detailed/staking-detailed.ingest";
import { Quotes } from "src/ingesters/quotes/quotes.entity";
import { Twitter } from "src/ingesters/twitter/twitter.entity";
import { QuotesIngest } from "src/ingesters/quotes/quotes.ingest";
import { TwitterIngest } from "src/ingesters/twitter/twitter.ingest";
import { PricesEntity } from "src/ingesters/prices/prices.entity";
import { PricesIngest } from "src/ingesters/prices/prices.ingest";

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
        entityTarget: AccountsDelegationLegacyActive,
        fetcher: new AccountsDelegationLegacyActiveIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'accounts_total_balance_with_stake',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: AccountsTotalBalanceWithStake,
        fetcher: new AccountsTotalBalanceWithStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'accounts_total_stake',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: AccountsTotalStake,
        fetcher: new AccountsTotalStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        name: 'economics',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Economics,
        fetcher: new EconomicsIngest(this.apiConfigService, this.apiService, this.elasticService),
      },
      {
        name: 'exchanges',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Exchanges,
        fetcher: new ExchangesIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'github',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Github,
        fetcher: new GithubIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'google',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Google,
        fetcher: new GoogleIngest(),
      },
      {
        name: 'google_trends',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: GoogleTrends,
        fetcher: new GoogleTrendsIngest(),
      },
      {
        name: 'quotes',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Quotes,
        fetcher: new QuotesIngest(this.apiConfigService, this.apiService),
      },
      {
        name: 'staking',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: Staking,
        fetcher: new StakingIngest(this.apiConfigService, this.apiService, this.gatewayService),
      },
      {
        name: 'staking_historical',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: StakingDetailed,
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
        entityTarget: Twitter,
        fetcher: new TwitterIngest(this.apiService),
      },
      {
        name: 'prices',
        refreshInterval: CronExpression.EVERY_HOUR,
        entityTarget: PricesEntity,
        fetcher: new PricesIngest(this.apiConfigService, this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
