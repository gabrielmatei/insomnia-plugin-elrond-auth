import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CoinPriceResolver } from './coin-price.resolver';
import { PricesResolver } from './prices.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [PricesResolver, CoinPriceResolver],
  exports: [],
})
export class PricesModule { }
