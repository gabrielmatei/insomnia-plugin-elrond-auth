import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MaiarDexPoolResolver } from './maiar-dex-pool.resolver';
import { MaiarDexResolver } from './maiar-dex.resolver';
import { MaiarDexResolverService } from './maiar-dex.resolver.service';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [
    MaiarDexResolver,
    MaiarDexPoolResolver,
    MaiarDexResolverService,
  ],
  exports: [],
})
export class MaiarDexModule { }
