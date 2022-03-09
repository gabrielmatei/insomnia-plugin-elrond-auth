import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AccountsResolver } from './accounts.resolver';
import { ThresholdCountResolver } from './threshold-count.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [AccountsResolver, ThresholdCountResolver],
  exports: [],
})
export class AccountsModule { }
