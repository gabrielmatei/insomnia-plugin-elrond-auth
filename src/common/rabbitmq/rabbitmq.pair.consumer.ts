import { Injectable, Logger } from '@nestjs/common';
import { CompetingRabbitConsumer } from './rabbitmq.consumers';
import { PairEventEnum } from './entities/pair/pair-events.enum';
import { RabbitMqPairHandlerService } from './rabbitmq.pair.handler.service';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';
import { TradingInfoEntity } from '../timescale/entities/trading-info.entity';
import { ApiService } from '../network/api.service';
import { ApiConfigService } from '../api-config/api.config.service';
import { ApiUtils } from 'src/utils/api.utils';
import { Block } from './entities/block';
import { ApiSettings } from '../network/entities/api.settings';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class RabbitMqPairConsumer {
  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly gatewayService: GatewayService,
    private readonly pairHandlerService: RabbitMqPairHandlerService,
  ) {
    this.logger = new Logger(RabbitMqPairConsumer.name);
  }

  @CompetingRabbitConsumer({
    exchange: 'all_events',
    queueName: 'data-api',
  })
  async consumeEvents(rawEvents: any) {
    try {
      const block = await this.getBlockByHash(rawEvents?.hash);
      if (!block) {
        this.logger.log(`Could not fetch block details for hash '${rawEvents?.hash}'`);
        return;
      }

      const events = rawEvents?.events ?? [];

      this.logger.log(`Detected ${events.length} events on block with hash '${rawEvents?.hash}'`);

      const trades: TradingInfoEntity[] = [];
      for (const rawEvent of events) {
        switch (rawEvent.identifier) {
          case PairEventEnum.SwapTokensFixedInput:
            const swapFixedInputEvent = new SwapFixedInputEvent(rawEvent);
            if (swapFixedInputEvent.getEventName() !== 'swap') {
              continue;
            }

            const swapFixedInputTrades = await this.pairHandlerService.handleSwapEvent(swapFixedInputEvent, block);
            trades.push(...swapFixedInputTrades);
            break;
          case PairEventEnum.SwapTokensFixedOutput:
            const swapFixedOutputEvent = new SwapFixedOutputEvent(rawEvent);
            if (swapFixedOutputEvent.getEventName() !== 'swap') {
              continue;
            }

            const swapFixedOutputTrades = await this.pairHandlerService.handleSwapEvent(swapFixedOutputEvent, block);
            trades.push(...swapFixedOutputTrades);
            break;
        }
      }

      if (block.shard === 1) {
        await this.pairHandlerService.persistTrades(trades, block);
      }
    } catch (error) {
      this.logger.error(`An unhandled error occurred when consuming events: ${JSON.stringify(rawEvents)}`);
      this.logger.error(error);
    }
  }

  private async getBlockByHash(hash: string): Promise<Block | undefined> {
    const delays = [500, 1000, 2000, 4000];
    const shards = await this.gatewayService.getShards();

    for (const delay of delays) {
      for (const shard of shards) {
        try {
          const { data } = await this.apiService.get(
            `${this.apiConfigService.getGatewayUrl()}/block/${shard}/by-hash/${hash}`,
            new ApiSettings({ verbose: false })
          );
          return ApiUtils.mergeObjects(new Block(), data.block);
        } catch {
          // probably does not exist
        }
      }

      this.logger.log(`Could not fetch details about block with hash '${hash}'. Applying delay ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return undefined;
  }
}
