import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { CachingModule } from '../caching/caching.module';
import { TimescaleService } from './timescale.service';

@Module({
  imports: [
    forwardRef(() => CachingModule),
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'postgres',
        ...apiConfigService.getTimescaleConnection(),
        keepConnectionAlive: true,
        synchronize: false,
        entities: ['dist/**/*.entity{.ts,.js}'],
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [
    TimescaleService,
  ],
  exports: [
    TimescaleService,
  ],
})
export class TimescaleModule { }
