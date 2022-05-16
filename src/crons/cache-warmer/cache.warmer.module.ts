import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from 'src/common/common.module';
import { GithubModule } from 'src/common/github/github.module';
import { MaiarDexModule } from 'src/common/maiar-dex/maiar-dex.module';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';
import { CacheWarmerService } from './cache.warmer.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => CommonModule),
    forwardRef(() => MaiarDexModule),
    forwardRef(() => GithubModule),
    MicroserviceModule,
  ],
  providers: [
    CacheWarmerService,
  ],
})
export class CacheWarmerModule { }
