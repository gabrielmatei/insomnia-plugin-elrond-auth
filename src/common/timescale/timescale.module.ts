import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsCount } from 'src/ingesters/accounts-count/accounts-count.entity';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { TimescaleService } from './timescale.service';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([
      AccountsCount,
    ]),
  ],
  providers: [
    TimescaleService,
  ],
  exports: [
    TimescaleService,
  ],
})
export class TimescaleModule { }
