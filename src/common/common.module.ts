import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "./api-config/api.config.module";
import { CachingModule } from "./caching/caching.module";
import { ElasticModule } from "./elastic/elastic.module";
import { GatewayModule } from "./gateway/gateway.module";
import { GithubModule } from "./github/github.module";
import { MetricsModule } from "./metrics/metrics.module";
import { ApiModule } from "./network/api.module";
import { TimescaleModule } from "./timescale/timescale.module";

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
  ],
})
export class CommonModule { }
