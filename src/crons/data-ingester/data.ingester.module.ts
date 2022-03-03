import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common/common.module';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';
import { EndpointsServicesModule } from 'src/endpoints/endpoints.services.module';
import { AccountsBalanceIngest } from 'src/ingesters/accounts-balance/accounts-balance.ingest';
import { AccountsCountIngest } from 'src/ingesters/accounts-count/accounts-count.ingest';
import { AccountsDelegationLegacyActiveIngest } from 'src/ingesters/accounts-delegation-legacy-active/accounts-delegation-legacy-active.ingest';
import { AccountsDelegationIngest } from 'src/ingesters/accounts-delegation/accounts-delegation.ingest';
import { AccountsTotalBalanceWithStakeIngest } from 'src/ingesters/accounts-total-balance-with-stake/accounts-total-balance-with-stake.ingest';
import { AccountsTotalStakeIngest } from 'src/ingesters/accounts-total-stake/accounts-total-stake.ingest';
import { EconomicsIngest } from 'src/ingesters/economics/economics.ingest';
import { ExchangesDetailedIngest } from 'src/ingesters/exchanges-detailed/exchanges-detailed.ingest';
import { ExchangesIngest } from 'src/ingesters/exchanges/exchanges.ingest';
import { GithubIngest } from 'src/ingesters/github/github.ingest';
import { GoogleIngest } from 'src/ingesters/google/google.ingest';
import { PricesIngest } from 'src/ingesters/prices/prices.ingest';
import { QuotesIngest } from 'src/ingesters/quotes/quotes.ingest';
import { StakingDetailedIngest } from 'src/ingesters/staking-detailed/staking-detailed.ingest';
import { StakingIngest } from 'src/ingesters/staking/staking.ingest';
import { TransactionsDetailedIngest } from 'src/ingesters/transactions-detailed/transactions-detailed.ingest';
import { TransactionsIngest } from 'src/ingesters/transactions/transactions.ingest';
import { TrendsIngest } from 'src/ingesters/trends/trends.ingest';
import { TwitterIngest } from 'src/ingesters/twitter/twitter.ingest';
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
