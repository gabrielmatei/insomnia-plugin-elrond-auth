import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { PersistenceService } from './persistence.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'postgres',
        ...apiConfigService.getTimescaleConnection(),
        keepConnectionAlive: true,
        synchronize: false,
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
    PersistenceService,
  ],
  exports: [
    PersistenceService,
  ],
})
export class PersistenceModule { }
