import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigModule } from '../api-config/api.config.module';
import { MetricsModule } from '../metrics/metrics.module';
import { AWSTimestreamService } from './aws.timestream.service';

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => MetricsModule),
  ],
  providers: [
    AWSTimestreamService,
  ],
  exports: [
    AWSTimestreamService,
  ],
})
export class AWSModule { }
