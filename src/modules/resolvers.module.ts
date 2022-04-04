import { forwardRef, Module } from "@nestjs/common";
import { AccountsModule } from "./accounts/accounts.module";
import { ContractsModule } from "./contracts/contracts.module";
import { EconomicsModule } from "./economics/economics.module";
import { ExchangesModule } from "./exchanges/exchanges.module";
import { GithubModule } from "./github/github.module";
import { GoogleModule } from "./google/google.module";
import { MaiarDexModule } from "./maiar-dex/maiar-dex.module";
import { MaiarModule } from "./maiar/maiar.module";
import { NftsModule } from "./nfts/nfts.module";
import { PricesModule } from "./prices/prices.module";
import { QuotesModule } from "./quotes/quotes.module";
import { StakingModule } from "./staking/staking.module";
import { TokensModule } from "./tokens/tokens.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { TrendsModule } from "./trends/trends.module";
import { TwitterModule } from "./twitter/twitter.module";

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    forwardRef(() => ContractsModule),
    forwardRef(() => EconomicsModule),
    forwardRef(() => ExchangesModule),
    forwardRef(() => GithubModule),
    forwardRef(() => GoogleModule),
    forwardRef(() => MaiarModule),
    forwardRef(() => MaiarDexModule),
    forwardRef(() => NftsModule),
    forwardRef(() => PricesModule),
    forwardRef(() => QuotesModule),
    forwardRef(() => StakingModule),
    forwardRef(() => TokensModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => TrendsModule),
    forwardRef(() => TwitterModule),
  ],
  exports: [
    AccountsModule,
    ContractsModule,
    EconomicsModule,
    ExchangesModule,
    GithubModule,
    GoogleModule,
    MaiarModule,
    MaiarDexModule,
    NftsModule,
    PricesModule,
    QuotesModule,
    StakingModule,
    TokensModule,
    TransactionsModule,
    TrendsModule,
    TwitterModule,
  ],
})
export class ResolversModule { }
