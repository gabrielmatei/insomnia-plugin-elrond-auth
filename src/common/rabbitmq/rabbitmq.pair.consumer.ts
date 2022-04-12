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
            await this.pairHandlerService.handleSwapEvent(new SwapFixedInputEvent(rawEvent));
            break;
          case PairEventEnum.SwapTokensFixedOutput:
            await this.pairHandlerService.handleSwapEvent(new SwapFixedOutputEvent(rawEvent));
            break;
        }
      }
    } catch (error) {
      this.logger.error(`An unhandled error occurred when consuming events: ${JSON.stringify(rawEvents)}`);
      this.logger.error(error);
    }
  }
}
