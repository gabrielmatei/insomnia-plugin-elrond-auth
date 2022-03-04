import { Injectable } from "@nestjs/common";
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
import { CronExpressionExtended } from "src/utils/enums";
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
        refreshInterval: CronExpressionExtended.EVERY_HOUR,
        fetcher: this.accountsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsCountIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsBalanceIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsDelegationIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsDelegationLegacyActiveIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsTotalBalanceWithStakeIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.accountsTotalStakeIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR,
        fetcher: this.economicsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.exchangesIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR, // TODO
        fetcher: this.exchangesDetailedIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_4_25AM,
        fetcher: this.githubIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR,
        fetcher: this.githubActivityIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_5_20AM,
        fetcher: this.githubCommitsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_2_15AM,
        fetcher: this.githubContributorsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR,
        fetcher: this.googleIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_MINUTE,
        fetcher: this.quotesIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_8_HOURS,
        fetcher: this.stakingIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_5PM,
        fetcher: this.stakingNewIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.stakingDetailedIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR,
        fetcher: this.transactionsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_HOUR, // TODO
        fetcher: this.transactionsDetailedIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.trendsIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM,
        fetcher: this.twitterIngest,
      },
      {
        refreshInterval: CronExpressionExtended.EVERY_MINUTE,
        fetcher: this.pricesIngest,
      },
    ];
    this.ingester.start(items);
  }
}
