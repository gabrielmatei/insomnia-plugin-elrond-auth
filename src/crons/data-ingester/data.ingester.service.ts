import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CachingService } from "src/common/caching/caching.service";
import { CacheInfo } from "src/common/caching/entities/cache.info";
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
// import { GithubActivityIngest } from "src/ingesters/github-activity.ingest";
// import { GithubCommitsIngest } from "src/ingesters/github-commits.ingest";
// import { GithubContributorsIngest } from "src/ingesters/github-contributors.ingest";
// import { GithubIngest } from "src/ingesters/github.ingest";
import { GoogleIngest } from "src/ingesters/google.ingest";
import { MaiarDexIngest } from "src/ingesters/maiar-dex.ingest";
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
import { Locker } from "src/utils/locker";
import { IngestItem } from "./entities/ingest.item";
import { Ingester } from "./ingester";

@Injectable()
export class DataIngesterService {
  private readonly logger: Logger;

  constructor(
    private readonly cachingService: CachingService,
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
    // private readonly githubIngest: GithubIngest,
    // private readonly githubActivityIngest: GithubActivityIngest,
    // private readonly githubCommitsIngest: GithubCommitsIngest,
    // private readonly githubContributorsIngest: GithubContributorsIngest,
    private readonly googleIngest: GoogleIngest,
    private readonly maiarDexIngest: MaiarDexIngest,
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
    this.logger = new Logger(DataIngesterService.name);

    const items: IngestItem[] = [
      { fetcher: this.accountsIngest, refreshInterval: CronExpressionExtended.EVERY_HOUR },
      { fetcher: this.accountsCountIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.accountsBalanceIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.accountsDelegationIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.accountsDelegationLegacyActiveIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.accountsTotalBalanceWithStakeIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.accountsTotalStakeIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.economicsIngest, refreshInterval: CronExpressionExtended.EVERY_HOUR },
      { fetcher: this.exchangesIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.exchangesDetailedIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      // { fetcher: this.githubIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_4_25AM },
      // { fetcher: this.githubActivityIngest, refreshInterval: CronExpressionExtended.EVERY_HOUR },
      // { fetcher: this.githubCommitsIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_5_20AM },
      // { fetcher: this.githubContributorsIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_2_15AM },
      { fetcher: this.googleIngest, refreshInterval: CronExpressionExtended.EVERY_HOUR },
      { fetcher: this.maiarDexIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.quotesIngest, refreshInterval: CronExpressionExtended.EVERY_HOUR },
      { fetcher: this.stakingIngest, refreshInterval: CronExpressionExtended.EVERY_8_HOURS },
      { fetcher: this.stakingNewIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_5PM },
      { fetcher: this.stakingDetailedIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.transactionsIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.transactionsDetailedIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.trendsIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.twitterIngest, refreshInterval: CronExpressionExtended.EVERY_DAY_AT_12_10AM },
      { fetcher: this.pricesIngest, refreshInterval: CronExpressionExtended.EVERY_MINUTE },
    ];
    this.ingester.start(items);
  }

  @Cron(CronExpressionExtended.EVERY_5_MINUTES)
  public async handleNewJobs() {
    await Locker.lock('New jobs handler', async () => {
      const scheduledJobsKeys = await this.cachingService.getKeys(CacheInfo.ScheduledJob().key);
      const scheduledJobsRaw = await this.cachingService.getCacheMultiple<string>(scheduledJobsKeys);
      const scheduledJobs = Object.values(scheduledJobsRaw).distinct();

      if (scheduledJobs.length === 0) {
        return;
      }

      this.logger.log(`Found ${scheduledJobs.length} jobs to run now`);

      for (const job of scheduledJobs) {
        await this.cachingService.deleteInCache(CacheInfo.ScheduledJob(job).key);

        const item = this.ingester.getIngestItem(job);
        if (!item) {
          continue;
        }

        await this.ingester.fetchRecords(item);
      }
    }, true);
  }
}
