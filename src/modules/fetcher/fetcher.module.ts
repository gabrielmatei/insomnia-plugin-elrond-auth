import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { FetcherResolver } from './fetcher.resolver';
import { FetcherService } from './fetcher.service';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [FetcherService, FetcherResolver],
  exports: [FetcherService],
})
export class FetcherModule { }
