import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "./api-config/api.config.module";
import { CachingModule } from "./caching/caching.module";
import { MetricsModule } from "./metrics/metrics.module";
import { ApiModule } from "./network/api.module";
import { PersistenceModule } from "./persistence/persistence.module";

@Module({
  imports: [
    forwardRef(() => ApiConfigModule),
    forwardRef(() => CachingModule),
    forwardRef(() => ApiModule),
    forwardRef(() => MetricsModule),
    forwardRef(() => PersistenceModule),
  ],
  exports: [
    ApiConfigModule,
    CachingModule,
    ApiModule,
    MetricsModule,
    PersistenceModule,
  ],
})
export class CommonModule { }
