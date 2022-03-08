import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TrendsResolver } from './trends.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [TrendsResolver],
  exports: [],
})
export class TrendsModule { }
