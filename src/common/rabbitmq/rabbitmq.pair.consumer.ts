import { Injectable, Logger } from '@nestjs/common';
import { CompetingRabbitConsumer } from './rabbitmq.consumers';
import { PairEventEnum } from './entities/pair/pair-events.enum';
import { RabbitMqPairHandlerService } from './rabbitmq.pair.handler.service';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';

@Injectable()
export class RabbitMqPairConsumer {
  private readonly logger: Logger;

  constructor(
    private readonly pairHandlerService: RabbitMqPairHandlerService,
  ) {
    this.logger = new Logger(RabbitMqPairConsumer.name);
  }

  @CompetingRabbitConsumer({
    exchange: 'all_events',
    queueName: 'growth-api',
  })
  async consumeEvents(rawEvents: any) {
    try {
      const events = rawEvents?.events;

      for (const rawEvent of events) {
        switch (rawEvent.identifier) {
          case PairEventEnum.SwapTokensFixedInput:
            const swapFixedInputEvent = new SwapFixedInputEvent(rawEvent);
            if (swapFixedInputEvent.getEventName() !== 'swap') {
              continue;
            }
            await this.pairHandlerService.handleSwapEvent(swapFixedInputEvent);
            break;
          case PairEventEnum.SwapTokensFixedOutput:
            const swapFixedOutputEvent = new SwapFixedOutputEvent(rawEvent);
            if (swapFixedOutputEvent.getEventName() !== 'swap') {
              continue;
            }
            await this.pairHandlerService.handleSwapEvent(swapFixedOutputEvent);
            break;
        }
      }
    } catch (error) {
      this.logger.error(`An unhandled error occurred when consuming events: ${JSON.stringify(rawEvents)}`);
      this.logger.error(error);
    }
  }
}
