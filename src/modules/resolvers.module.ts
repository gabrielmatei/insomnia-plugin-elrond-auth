import { forwardRef, Module } from "@nestjs/common";
import { AccountsModule } from "./accounts/accounts.module";
import { EconomicsModule } from "./economics/economics.module";
import { ExchangesModule } from "./exchanges/exchanges.module";
import { GithubModule } from "./github/github.module";
import { GoogleModule } from "./google/google.module";
import { PricesModule } from "./prices/prices.module";
import { QuotesModule } from "./quotes/quotes.module";
import { StakingModule } from "./staking/staking.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { TrendsModule } from "./trends/trends.module";
import { TwitterModule } from "./twitter/twitter.module";

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    forwardRef(() => EconomicsModule),
    forwardRef(() => ExchangesModule),
    forwardRef(() => GithubModule),
    forwardRef(() => GoogleModule),
    forwardRef(() => PricesModule),
    forwardRef(() => QuotesModule),
    forwardRef(() => StakingModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => TrendsModule),
    forwardRef(() => TwitterModule),
  ],
  exports: [
    AccountsModule,
    EconomicsModule,
    ExchangesModule,
    GithubModule,
    GoogleModule,
    PricesModule,
    QuotesModule,
    StakingModule,
    TransactionsModule,
    TrendsModule,
    TwitterModule,
  ],
})
export class ResolversModule { }
