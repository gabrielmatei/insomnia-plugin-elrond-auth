import { Injectable } from '@nestjs/common';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';
import { TradingService } from '../trading/trading.service';

@Injectable()
export class RabbitMqPairHandlerService {
  constructor(
    private readonly tradingService: TradingService,
  ) { }

  public async handleSwapEvent(event: SwapFixedInputEvent | SwapFixedOutputEvent): Promise<void> {
    await this.tradingService.indexEvent(event);
  }
}
