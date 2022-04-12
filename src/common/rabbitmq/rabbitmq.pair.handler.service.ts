import { Injectable } from '@nestjs/common';
import { MaiarDexService } from '../maiar-dex/maiar-dex.service';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';

@Injectable()
export class RabbitMqPairHandlerService {
  constructor(private readonly maiarDexService: MaiarDexService) {
  }

  public async handleSwapEvent(
    event: SwapFixedInputEvent | SwapFixedOutputEvent,
  ): Promise<void> {
    const pairs = await this.maiarDexService.getAllPairs();

    const tokenIn = event.getTokenIn().tokenID;
    const tokenInReserves = event.getTokenInReserves().toString(10);
    const firstToken = pairs.find(pair => pair.firstToken.identifier === tokenIn || pair.secondToken.identifier === tokenIn);

    const tokenOut = event.getTokenOut().tokenID;
    const tokenOutReserves = event.getTokenOutReserves().toString(10);

    console.log({
      tokenIn,
      tokenInReserves,
      firstToken,
      tokenOut,
      tokenOutReserves,
    });
  }
}
