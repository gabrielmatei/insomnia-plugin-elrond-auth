import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ContractsResolver } from './contracts.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [ContractsResolver],
  exports: [],
})
export class ContractsModule { }
