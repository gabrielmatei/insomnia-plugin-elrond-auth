import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MaiarDexPoolResolver } from './maiar-dex-pool.resolver';
import { MaiarDexWeeklyReportResolver } from './maiar-dex-weekly-report.resolver';
import { MaiarDexResolver } from './maiar-dex.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [MaiarDexResolver, MaiarDexPoolResolver, MaiarDexWeeklyReportResolver],
  exports: [],
})
export class MaiarDexModule { }
