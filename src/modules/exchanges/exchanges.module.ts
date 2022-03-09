import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ExchangeResolver } from './exchange.resolver';
import { ExchangesResolver } from './exchanges.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [ExchangesResolver, ExchangeResolver],
  exports: [],
})
export class ExchangesModule { }
