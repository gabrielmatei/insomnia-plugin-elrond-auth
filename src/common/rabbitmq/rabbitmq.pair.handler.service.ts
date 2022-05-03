import { Inject, Injectable, Logger } from '@nestjs/common';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';
import { TradingService } from '../trading/trading.service';
import { TradingInfoEntity } from '../timescale/entities/trading-info.entity';
import { PUB_SUB } from 'src/modules/redis.pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Block } from './entities/block';
import { BlockModel } from 'src/modules/trading/models/block.model';

@Injectable()
export class RabbitMqPairHandlerService {
  private readonly logger: Logger;

  constructor(
    private readonly tradingService: TradingService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {
    this.logger = new Logger(RabbitMqPairHandlerService.name);
  }

  public async handleSwapEvent(event: SwapFixedInputEvent | SwapFixedOutputEvent, block?: Block): Promise<TradingInfoEntity[]> {
    this.logger.log(`Detected swap event`);

    return await this.tradingService.indexEvent(event, block);
  }

  public async persistTrades(trades: TradingInfoEntity[], block: Block) {
    try {
      await this.tradingService.writeTrades(trades);
      await this.pubSub.publish('newBlock', { newBlock: BlockModel.fromTrades(block, trades) });
    } catch (error) {
      this.logger.error(`An unhandled error occurred when writing trades`);
      this.logger.error(error);
    }
  }
}
