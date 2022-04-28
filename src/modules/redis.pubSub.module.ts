import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Redis from 'ioredis';
import { ApiConfigService } from 'src/common/api-config/api.config.service';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [
        {
            provide: PUB_SUB,
            useFactory: (apiConfigService: ApiConfigService) => {
                const options: Redis.RedisOptions = {
                    host: apiConfigService.getRedisUrl(),
                    port: 6379,
                    retryStrategy: function () {
                        return 1000;
                    },
                };

                return new RedisPubSub({
                    publisher: new Redis.default(options),
                    subscriber: new Redis.default(options),
                });
            },
            inject: [ApiConfigService],
        },
        ApiConfigService,
    ],
    exports: [PUB_SUB],
})
export class RedisPubSubModule { }
