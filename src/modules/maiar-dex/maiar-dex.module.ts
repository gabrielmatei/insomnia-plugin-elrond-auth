import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MaiarDexModule as MaiarDexServiceModule } from 'src/common/maiar-dex/maiar-dex.module';
import { MaiarDexPoolResolver } from './maiar-dex-pool.resolver';
import { MaiarDexResolver } from './maiar-dex.resolver';
import { MaiarDexResolverService } from './maiar-dex.resolver.service';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => MaiarDexServiceModule),
  ],
  providers: [
    MaiarDexResolver,
    MaiarDexPoolResolver,
    MaiarDexResolverService,
  ],
  exports: [
    MaiarDexResolverService,
  ],
})
export class MaiarDexModule { }
