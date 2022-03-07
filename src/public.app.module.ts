import { Module } from '@nestjs/common';
import "./utils/extensions/array.extensions";
import "./utils/extensions/date.extensions";
import "./utils/extensions/number.extensions";
import { CommonModule } from './common/common.module';
import { LoggingModule } from './common/logging/logging.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { EndpointsServicesModule } from './endpoints/endpoints.services.module';
import { EndpointsControllersModule } from './endpoints/endpoints.controller';
import { ValuesModule } from './modules/values/values.module';

@Module({
  imports: [
    LoggingModule,
    CommonModule,
    ValuesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    EndpointsServicesModule,
    EndpointsControllersModule,
  ],
})
export class PublicAppModule { }
