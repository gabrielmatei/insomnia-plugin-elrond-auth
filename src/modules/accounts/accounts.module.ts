import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AccountsResolver } from './accounts.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [AccountsResolver],
  exports: [],
})
export class AccountsModule { }
