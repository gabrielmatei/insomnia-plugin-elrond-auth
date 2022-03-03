import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common/common.module';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';
import { EndpointsServicesModule } from 'src/endpoints/endpoints.services.module';
import { AccountsBalanceIngest } from 'src/ingesters/accounts-balance.ingest';
import { AccountsCountIngest } from 'src/ingesters/accounts-count.ingest';
import { AccountsDelegationLegacyActiveIngest } from 'src/ingesters/accounts-delegation-legacy-active.ingest';
import { AccountsDelegationIngest } from 'src/ingesters/accounts-delegation.ingest';
import { AccountsTotalBalanceWithStakeIngest } from 'src/ingesters/accounts-total-balance-with-stake.ingest';
import { AccountsTotalStakeIngest } from 'src/ingesters/accounts-total-stake.ingest';
import { AccountsIngest } from 'src/ingesters/accounts.ingest';
import { EconomicsIngest } from 'src/ingesters/economics.ingest';
import { ExchangesDetailedIngest } from 'src/ingesters/exchanges-detailed.ingest';
import { ExchangesIngest } from 'src/ingesters/exchanges.ingest';
import { GithubActivityIngest } from 'src/ingesters/github-activity.ingest';
import { GithubIngest } from 'src/ingesters/github.ingest';
import { GoogleIngest } from 'src/ingesters/google.ingest';
import { PricesIngest } from 'src/ingesters/prices.ingest';
import { QuotesIngest } from 'src/ingesters/quotes.ingest';
import { StakingDetailedIngest } from 'src/ingesters/staking-detailed.ingest';
import { StakingIngest } from 'src/ingesters/staking.ingest';
import { TransactionsDetailedIngest } from 'src/ingesters/transactions-detailed.ingest';
import { TransactionsIngest } from 'src/ingesters/transactions.ingest';
import { TrendsIngest } from 'src/ingesters/trends.ingest';
import { TwitterIngest } from 'src/ingesters/twitter.ingest';
import { DataIngesterService } from './data.ingester.service';
import { Ingester } from './ingester';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => CommonModule),
    forwardRef(() => EndpointsServicesModule),
    MicroserviceModule,
  ],
  providers: [
    DataIngesterService,
    Ingester,
    AccountsIngest,
    AccountsCountIngest,
    AccountsBalanceIngest,
    AccountsDelegationIngest,
    AccountsDelegationLegacyActiveIngest,
    AccountsTotalBalanceWithStakeIngest,
    AccountsTotalStakeIngest,
    EconomicsIngest,
    ExchangesIngest,
    ExchangesDetailedIngest,
    GithubIngest,
    GithubActivityIngest,
    GoogleIngest,
    QuotesIngest,
    StakingIngest,
    StakingDetailedIngest,
    TransactionsIngest,
    TransactionsDetailedIngest,
    TrendsIngest,
    TwitterIngest,
    PricesIngest,
  ],
})
export class DataIngesterModule { }
