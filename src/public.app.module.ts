import { Module } from '@nestjs/common';
import "./utils/extensions/array.extensions";
import "./utils/extensions/date.extensions";
import "./utils/extensions/number.extensions";
import { CommonModule } from './common/common.module';
import { LoggingModule } from './common/logging/logging.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ResolversModule } from './modules/resolvers.module';
import { HealthCheckController } from './common/health-check/health.check.controller';

@Module({
  imports: [
    LoggingModule,
    CommonModule,
    ResolversModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      useGlobalPrefix: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  controllers: [
    HealthCheckController,
  ],
})
export class PublicAppModule { }
