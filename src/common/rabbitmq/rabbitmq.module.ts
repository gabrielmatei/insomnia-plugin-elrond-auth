import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { MaiarDexModule } from '../maiar-dex/maiar-dex.module';
import { RabbitMqPairConsumer } from './rabbitmq.pair.consumer';
import { RabbitMqPairHandlerService } from './rabbitmq.pair.handler.service';

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => MaiarDexModule),
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
