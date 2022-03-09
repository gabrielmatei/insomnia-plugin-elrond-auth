import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CoinQuoteResolver } from './coin-quote.resolver';
import { QuotesResolver } from './quotes.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [QuotesResolver, CoinQuoteResolver],
  exports: [],
})
export class QuotesModule { }
