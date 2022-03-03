import { Injectable } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { AccountsCountIngest } from "src/ingesters/accounts-count/accounts-count.ingest";
import { AccountsBalanceIngest } from "src/ingesters/accounts-balance/accounts-balance.ingest";
import { EconomicsIngest } from "src/ingesters/economics/economics.ingest";
import { TransactionsIngest } from "src/ingesters/transactions/transactions.ingest";
import { AccountsDelegationIngest } from "src/ingesters/accounts-delegation/accounts-delegation.ingest";
import { AccountsTotalStakeIngest } from "src/ingesters/accounts-total-stake/accounts-total-stake.ingest";
import { AccountsDelegationLegacyActiveIngest } from "src/ingesters/accounts-delegation-legacy-active/accounts-delegation-legacy-active.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "src/ingesters/accounts-total-balance-with-stake/accounts-total-balance-with-stake.ingest";
import { ExchangesIngest } from "src/ingesters/exchanges/exchanges.ingest";
import { GithubIngest } from "src/ingesters/github/github.ingest";
import { GoogleIngest } from "src/ingesters/google/google.ingest";
import { StakingIngest } from "src/ingesters/staking/staking.ingest";
import { StakingDetailedIngest } from "src/ingesters/staking-detailed/staking-detailed.ingest";
import { QuotesIngest } from "src/ingesters/quotes/quotes.ingest";
import { TwitterIngest } from "src/ingesters/twitter/twitter.ingest";
import { PricesIngest } from "src/ingesters/prices/prices.ingest";
import { TransactionsDetailedIngest } from "src/ingesters/transactions-detailed/transactions-detailed.ingest";
import { ExchangesDetailedIngest } from "src/ingesters/exchanges-detailed/exchanges-detailed.ingest";
import { ActiveUsersIngest } from "src/ingesters/active-users/active-users.ingest";
import { Ingester } from "./ingester";
import { IngestItem } from "./entities/ingest.item";
import { TrendsIngest } from "src/ingesters/trends/trends.ingest";

@Injectable()
export class DataIngesterService {
  constructor(
    private readonly ingester: Ingester,
    private readonly accountsCountIngest: AccountsCountIngest,
    private readonly accountsBalanceIngest: AccountsBalanceIngest,
    private readonly accountsDelegationIngest: AccountsDelegationIngest,
    private readonly accountsDelegationLegacyActiveIngest: AccountsDelegationLegacyActiveIngest,
    private readonly accountsTotalBalanceWithStakeIngest: AccountsTotalBalanceWithStakeIngest,
    private readonly accountsTotalStakeIngest: AccountsTotalStakeIngest,
    private readonly activeUsersIngest: ActiveUsersIngest,
    private readonly economicsIngest: EconomicsIngest,
    private readonly exchangesIngest: ExchangesIngest,
    private readonly exchangesDetailedIngest: ExchangesDetailedIngest,
    private readonly githubIngest: GithubIngest,
    private readonly googleIngest: GoogleIngest,
    private readonly trendsIngest: TrendsIngest,
    private readonly quotesIngest: QuotesIngest,
    private readonly stakingIngest: StakingIngest,
    private readonly stakingDetailedIngest: StakingDetailedIngest,
    private readonly transactionsIngest: TransactionsIngest,
    private readonly transactionsDetailedIngest: TransactionsDetailedIngest,
    private readonly twitterIngest: TwitterIngest,
    private readonly pricesIngest: PricesIngest,
  ) {
    const items: IngestItem[] = [
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsCountIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsBalanceIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsDelegationIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsDelegationLegacyActiveIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsTotalBalanceWithStakeIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsTotalStakeIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.activeUsersIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.economicsIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.exchangesIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.exchangesDetailedIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.githubIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.googleIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.quotesIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.stakingIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.stakingDetailedIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.transactionsIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.transactionsDetailedIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.trendsIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.twitterIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.pricesIngest,
      },
    ];
    this.ingester.start(items);
  }
}
