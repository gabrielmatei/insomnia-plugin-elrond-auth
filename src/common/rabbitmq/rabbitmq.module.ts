import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { ApiModule } from '../network/api.module';
import { TradingModule } from '../trading/trading.module';
import { RabbitMqPairConsumer } from './rabbitmq.pair.consumer';
import { RabbitMqPairHandlerService } from './rabbitmq.pair.handler.service';

@Module({
  imports: [
    ApiConfigModule,
    ApiModule,
    TradingModule,
  ],
  providers: [
    RabbitMqPairConsumer,
    RabbitMqPairHandlerService,
  ],
})
export class RabbitMqModule {
  static register(): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          imports: [ApiConfigModule],
          inject: [ApiConfigService],
          useFactory: (apiConfigService: ApiConfigService) => {
            return {
              name: apiConfigService.getEventsNotifierExchange(),
              type: 'fanout',
              options: {},
              uri: apiConfigService.getEventsNotifierUrl(),
            };
          },
        }),
      ],
    };
  }
}
