import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CoinResolver } from './coin.resolver';
import { PricesResolver } from './prices.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [PricesResolver, CoinResolver],
  exports: [],
})
export class PricesModule { }
