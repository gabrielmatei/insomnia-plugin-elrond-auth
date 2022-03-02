import { Injectable } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { AccountsCountIngest } from "src/ingesters/accounts-count/accounts-count.ingest";
import { AccountsBalanceIngest } from "src/ingesters/accounts-balance/accounts-balance.ingest";
import { EconomicsIngest } from "src/ingesters/economics/economics.ingest";
import { Ingester, IngestItem } from "./ingester";
import { TransactionsIngest } from "src/ingesters/transactions/transactions.ingest";
import { AccountsDelegationIngest } from "src/ingesters/accounts-delegation/accounts-delegation.ingest";
import { AccountsTotalStakeIngest } from "src/ingesters/accounts-total-stake/accounts-total-stake.ingest";
import { AccountsDelegationLegacyActiveIngest } from "src/ingesters/accounts-delegation-legacy-active/accounts-delegation-legacy-active.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "src/ingesters/accounts-total-balance-with-stake/accounts-total-balance-with-stake.ingest";
import { ExchangesIngest } from "src/ingesters/exchanges/exchanges.ingest";
import { GithubIngest } from "src/ingesters/github/github.ingest";
import { GoogleIngest } from "src/ingesters/google/google.ingest";
import { GoogleTrendsIngest } from "src/ingesters/google-trends/google-trends.ingest";
import { StakingIngest } from "src/ingesters/staking/staking.ingest";
import { StakingDetailedIngest } from "src/ingesters/staking-detailed/staking-detailed.ingest";
import { QuotesIngest } from "src/ingesters/quotes/quotes.ingest";
import { TwitterIngest } from "src/ingesters/twitter/twitter.ingest";
import { PricesIngest } from "src/ingesters/prices/prices.ingest";
import { TransactionsDetailedIngest } from "src/ingesters/transactions-detailed/transactions-detailed.ingest";
import { ExchangesDetailedIngest } from "src/ingesters/exchanges-detailed/exchanges-detailed.ingest";
import { ActiveUsersIngest } from "src/ingesters/active-users/active-users.ingest";

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
        fetcher: new AccountsCountIngest(this.apiConfigService, this.elasticService, this.timescaleService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsBalanceIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsDelegationIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsDelegationLegacyActiveIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsTotalBalanceWithStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new AccountsTotalStakeIngest(this.apiConfigService, this.elasticService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_10_SECONDS,
        fetcher: new ActiveUsersIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new EconomicsIngest(this.apiConfigService, this.apiService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new ExchangesIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new ExchangesDetailedIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GithubIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GoogleIngest(),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new GoogleTrendsIngest(),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new QuotesIngest(this.apiConfigService, this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new StakingIngest(this.apiConfigService, this.apiService, this.gatewayService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new StakingDetailedIngest(this.apiConfigService, this.apiService, this.gatewayService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new TransactionsIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new TransactionsDetailedIngest(this.apiConfigService, this.elasticService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new TwitterIngest(this.apiService),
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: new PricesIngest(this.apiConfigService, this.apiService),
      },
    ];
    this.ingester = new Ingester(items, this.schedulerRegistry, this.timescaleService);
    this.ingester.start();
  }
}
