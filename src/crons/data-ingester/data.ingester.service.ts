import { Injectable } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { AccountsBalanceIngest } from "src/ingesters/accounts-balance.ingest";
import { AccountsCountIngest } from "src/ingesters/accounts-count.ingest";
import { AccountsDelegationLegacyActiveIngest } from "src/ingesters/accounts-delegation-legacy-active.ingest";
import { AccountsDelegationIngest } from "src/ingesters/accounts-delegation.ingest";
import { AccountsTotalBalanceWithStakeIngest } from "src/ingesters/accounts-total-balance-with-stake.ingest";
import { AccountsTotalStakeIngest } from "src/ingesters/accounts-total-stake.ingest";
import { AccountsIngest } from "src/ingesters/accounts.ingest";
import { EconomicsIngest } from "src/ingesters/economics.ingest";
import { ExchangesDetailedIngest } from "src/ingesters/exchanges-detailed.ingest";
import { ExchangesIngest } from "src/ingesters/exchanges.ingest";
import { GithubActivityIngest } from "src/ingesters/github-activity.ingest";
import { GithubCommitsIngest } from "src/ingesters/github-commits.ingest";
import { GithubContributorsIngest } from "src/ingesters/github-contributors.ingest";
import { GithubIngest } from "src/ingesters/github.ingest";
import { GoogleIngest } from "src/ingesters/google.ingest";
import { PricesIngest } from "src/ingesters/prices.ingest";
import { QuotesIngest } from "src/ingesters/quotes.ingest";
import { StakingDetailedIngest } from "src/ingesters/staking-detailed.ingest";
import { StakingNewIngest } from "src/ingesters/staking-new.ingest";
import { StakingIngest } from "src/ingesters/staking.ingest";
import { TransactionsDetailedIngest } from "src/ingesters/transactions-detailed.ingest";
import { TransactionsIngest } from "src/ingesters/transactions.ingest";
import { TrendsIngest } from "src/ingesters/trends.ingest";
import { TwitterIngest } from "src/ingesters/twitter.ingest";
import { IngestItem } from "./entities/ingest.item";
import { Ingester } from "./ingester";

@Injectable()
export class DataIngesterService {
  constructor(
    private readonly ingester: Ingester,
    private readonly accountsIngest: AccountsIngest,
    private readonly accountsCountIngest: AccountsCountIngest,
    private readonly accountsBalanceIngest: AccountsBalanceIngest,
    private readonly accountsDelegationIngest: AccountsDelegationIngest,
    private readonly accountsDelegationLegacyActiveIngest: AccountsDelegationLegacyActiveIngest,
    private readonly accountsTotalBalanceWithStakeIngest: AccountsTotalBalanceWithStakeIngest,
    private readonly accountsTotalStakeIngest: AccountsTotalStakeIngest,
    private readonly economicsIngest: EconomicsIngest,
    private readonly exchangesIngest: ExchangesIngest,
    private readonly exchangesDetailedIngest: ExchangesDetailedIngest,
    private readonly githubIngest: GithubIngest,
    private readonly githubActivityIngest: GithubActivityIngest,
    private readonly githubCommitsIngest: GithubCommitsIngest,
    private readonly githubContributorsIngest: GithubContributorsIngest,
    private readonly googleIngest: GoogleIngest,
    private readonly trendsIngest: TrendsIngest,
    private readonly quotesIngest: QuotesIngest,
    private readonly stakingIngest: StakingIngest,
    private readonly stakingNewIngest: StakingNewIngest,
    private readonly stakingDetailedIngest: StakingDetailedIngest,
    private readonly transactionsIngest: TransactionsIngest,
    private readonly transactionsDetailedIngest: TransactionsDetailedIngest,
    private readonly twitterIngest: TwitterIngest,
    private readonly pricesIngest: PricesIngest,
  ) {
    const items: IngestItem[] = [
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.accountsIngest,
      },
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
        fetcher: this.githubActivityIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.githubCommitsIngest,
      },
      {
        refreshInterval: CronExpression.EVERY_HOUR,
        fetcher: this.githubContributorsIngest,
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
        fetcher: this.stakingNewIngest,
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
