import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "./api-config/api.config.module";
import { CachingModule } from "./caching/caching.module";
import { ElasticModule } from "./elastic/elastic.module";
import { GatewayModule } from "./gateway/gateway.module";
import { GithubModule } from "./github/github.module";
import { MaiarDexModule } from "./maiar-dex/maiar-dex.module";
import { MetricsModule } from "./metrics/metrics.module";
import { ApiModule } from "./network/api.module";
import { StakingModule } from "./staking/staking.module";
import { TimescaleModule } from "./timescale/timescale.module";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
  imports: [
    forwardRef(() => ApiConfigModule),
    forwardRef(() => CachingModule),
    forwardRef(() => ApiModule),
    forwardRef(() => MetricsModule),
    forwardRef(() => TimescaleModule),
    forwardRef(() => ElasticModule),
    forwardRef(() => GatewayModule),
    forwardRef(() => GithubModule),
    forwardRef(() => StakingModule),
    forwardRef(() => TransactionsModule),
    forwardRef(() => MaiarDexModule),
  ],
  exports: [
    ApiConfigModule,
    CachingModule,
    ApiModule,
    MetricsModule,
    TimescaleModule,
    ElasticModule,
    GatewayModule,
    GithubModule,
    StakingModule,
    TransactionsModule,
    MaiarDexModule,
  ],
})
export class CommonModule { }
