import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TradingInfoResolver } from './trading-info.resolver';
import { TradingResolver } from './trading.resolver';
import { TradingModule as TradingServiceModule } from 'src/common/trading/trading.module';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    forwardRef(() => TradingServiceModule),
  ],
  providers: [TradingResolver, TradingInfoResolver],
  exports: [],
})
export class TradingModule { }
