import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MaiarDexPoolResolver } from './maiar-dex-pool.resolver';
import { MaiarDexResolver } from './maiar-dex.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [MaiarDexResolver, MaiarDexPoolResolver],
  exports: [],
})
export class MaiarDexModule { }
