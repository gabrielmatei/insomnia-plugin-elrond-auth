import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MaiarResolver } from './maiar.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [MaiarResolver],
  exports: [],
})
export class MaiarModule { }
