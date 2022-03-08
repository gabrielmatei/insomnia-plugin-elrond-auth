import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { EconomicsResolver } from './economics.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [EconomicsResolver],
  exports: [],
})
export class EconomicsModule { }
