import { Module } from '@nestjs/common';
import { CachingModule } from './common/caching/caching.module';
import { MetricsController } from './common/metrics/metrics.controller';
import { MetricsModule } from './common/metrics/metrics.module';
import { ApiConfigModule } from './common/api-config/api.config.module';
import { CacheController } from './common/caching/cache.controller';
import { MicroserviceModule } from './common/microservice/microservice.module';
import { HealthCheckController } from './common/health-check/health.check.controller';
import { JobsModule } from './endpoints/jobs/jobs.module';
import { JobsController } from './endpoints/jobs/jobs.controller';

@Module({
  imports: [
    ApiConfigModule,
    CachingModule,
    MetricsModule,
    JobsModule,
    MicroserviceModule,
  ],
  controllers: [
    MetricsController,
    CacheController,
    HealthCheckController,
    JobsController,
  ],
})
export class PrivateAppModule { }
