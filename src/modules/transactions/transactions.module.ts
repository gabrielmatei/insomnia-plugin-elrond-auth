import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [TransactionsResolver],
  exports: [],
})
export class TransactionsModule { }
