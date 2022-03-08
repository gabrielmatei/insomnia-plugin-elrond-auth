import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { ApiConfigService } from './common/api-config/api.config.service';
import { PrivateAppModule } from './private.app.module';
import { PublicAppModule } from './public.app.module';
import * as bodyParser from 'body-parser';
import { Logger } from '@nestjs/common';
import { QueueWorkerModule } from './workers/queue.worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PubSubModule } from './websockets/pub.sub.module';
import { SocketAdapter } from './websockets/socket.adapter';
import { DataIngesterModule } from './crons/data-ingester/data.ingester.module';
import { CacheWarmerModule } from './crons/cache-warmer/cache.warmer.module';
import { TransactionProcessorModule } from './crons/transaction-processor/transaction.processor.module';

async function bootstrap() {
  const publicApp = await NestFactory.create(PublicAppModule);
  publicApp.use(bodyParser.json({ limit: '1mb' }));
  publicApp.enableCors();
  publicApp.useLogger(publicApp.get(WINSTON_MODULE_NEST_PROVIDER));

  const apiConfigService = publicApp.get<ApiConfigService>(ApiConfigService);
  const httpAdapterHostService = publicApp.get<HttpAdapterHost>(HttpAdapterHost);

  const httpServer = httpAdapterHostService.httpAdapter.getHttpServer();
  httpServer.keepAliveTimeout = apiConfigService.getServerTimeout();
  httpServer.headersTimeout = apiConfigService.getHeadersTimeout(); //`keepAliveTimeout + server's expected response time`

  // TODO add interceptors

  // const metricsService = publicApp.get<MetricsService>(MetricsService);
  // const cachingService = publicApp.get<CachingService>(CachingService);
  // const httpAdapterHostService = publicApp.get<HttpAdapterHost>(HttpAdapterHost);

  // publicApp.useGlobalInterceptors(
  //   new LoggingInterceptor(metricsService),
  //   new CachingInterceptor(cachingService, httpAdapterHostService, metricsService),
  // );

  const description = readFileSync(join(__dirname, '..', 'docs', 'swagger.md'), 'utf8');

  let documentBuilder = new DocumentBuilder()
    .setTitle('Elrond Microservice API')
    .setDescription(description)
    .setVersion('1.0.0')
    .setExternalDoc('Elrond Docs', 'https://docs.elrond.com');

  const apiUrls = apiConfigService.getSwaggerUrls();
  for (const apiUrl of apiUrls) {
    documentBuilder = documentBuilder.addServer(apiUrl);
  }

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(publicApp, config);
  SwaggerModule.setup('', publicApp, document);

  if (apiConfigService.getIsPublicApiFeatureActive()) {
    await publicApp.listen(apiConfigService.getPublicApiFeaturePort());
  }

  if (apiConfigService.getIsPrivateApiFeatureActive()) {
    const privateApp = await NestFactory.create(PrivateAppModule);
    await privateApp.listen(apiConfigService.getPrivateApiFeaturePort());
  }

  if (apiConfigService.getIsCacheWarmerFeatureActive()) {
    const cacheWarmerApp = await NestFactory.create(CacheWarmerModule);
    await cacheWarmerApp.listen(apiConfigService.getCacheWarmerFeaturePort());
  }

  if (apiConfigService.getIsDataIngesterFeatureActive()) {
    const dataIngesterApp = await NestFactory.create(DataIngesterModule);
    await dataIngesterApp.listen(apiConfigService.getDataIngesterFeaturePort());
  }

  if (apiConfigService.getIsTransactionProcessorFeatureActive()) {
    const transactionProcessorApp = await NestFactory.create(TransactionProcessorModule);
    await transactionProcessorApp.listen(apiConfigService.getTransactionProcessorFeaturePort());
  }

  if (apiConfigService.getIsQueueWorkerFeatureActive()) {
    const queueWorkerApp = await NestFactory.create(QueueWorkerModule);
    await queueWorkerApp.listen(8000);
  }

  const logger = new Logger("Bootstrapper");
  logger.log(`Public API active: ${apiConfigService.getIsPrivateApiFeatureActive()}`);
  logger.log(`Private API active: ${apiConfigService.getIsPrivateApiFeatureActive()}`);
  logger.log(`Transaction processor active: ${apiConfigService.getIsTransactionProcessorFeatureActive()}`);
  logger.log(`Cache warmer active: ${apiConfigService.getIsCacheWarmerFeatureActive()}`);
  logger.log(`Data ingester active: ${apiConfigService.getIsDataIngesterFeatureActive()}`);
  logger.log(`Queue worker active: ${apiConfigService.getIsQueueWorkerFeatureActive()}`);

  const pubSubApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    PubSubModule,
    {
      transport: Transport.REDIS,
      options: {
        url: `redis://${apiConfigService.getRedisUrl()}:6379`,
        retryAttempts: 100,
        retryDelay: 1000,
        retry_strategy: function () {
          return 1000;
        },
      },
    },
  );
  pubSubApp.useWebSocketAdapter(new SocketAdapter(pubSubApp));

  await pubSubApp.listen();
}

bootstrap();
