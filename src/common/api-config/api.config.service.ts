import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) { }

  getApiUrl(): string {
    const apiUrl = this.configService.get<string>('urls.api');
    if (!apiUrl) {
      throw new Error('No API url present');
    }

    return apiUrl;
  }

  getSwaggerUrls(): string[] {
    const swaggerUrls = this.configService.get<string[]>('urls.swagger');
    if (!swaggerUrls) {
      throw new Error('No swagger urls present');
    }

    return swaggerUrls;
  }

  getRedisUrl(): string {
    const redisUrl = this.configService.get<string>('urls.redis');
    if (!redisUrl) {
      throw new Error('No redisUrl present');
    }

    return redisUrl;
  }

  getGatewayUrl(): string {
    const gatewayUrls = this.configService.get<string[]>('urls.gateway');
    if (!gatewayUrls) {
      throw new Error('No gateway urls present');
    }

    return gatewayUrls[Math.floor(Math.random() * gatewayUrls.length)];
  }

  getElasticUrl(): string {
    const elasticUrls = this.configService.get<string[]>('urls.elastic');
    if (!elasticUrls) {
      throw new Error('No elastic urls present');
    }

    return elasticUrls[Math.floor(Math.random() * elasticUrls.length)];
  }

  getInternalElasticUrl(): string {
    const internalElasticUrls = this.configService.get<string[]>('urls.internalElastic');
    if (!internalElasticUrls) {
      throw new Error('No internal elastic urls present');
    }

    return internalElasticUrls[Math.floor(Math.random() * internalElasticUrls.length)];
  }

  getTimescaleHost(): string {
    const host = this.configService.get<string>('timescale.host');
    if (!host) {
      throw new Error('No timescale.host present');
    }

    return host;
  }

  getTimescaleUsername(): string {
    const username = this.configService.get<string>('timescale.username');
    if (!username) {
      throw new Error('No timescale.username present');
    }

    return username;
  }

  getTimescalePassword(): string {
    const password = this.configService.get<string>('timescale.password');
    if (!password) {
      throw new Error('No timescale.password present');
    }

    return password;
  }

  getTimescaleDatabase(): string {
    const database = this.configService.get<string>('timescale.database');
    if (!database) {
      throw new Error('No timescale.database present');
    }

    return database;
  }

  getTimescalePort(): number {
    const port = this.configService.get<number>('timescale.port');
    if (!port) {
      throw new Error('No timescale.port present');
    }

    return port;
  }

  getTimescaleConnection(): { host: string, port: number, username: string, password: string, database: string } {
    return {
      host: this.getTimescaleHost(),
      port: this.getTimescalePort(),
      database: this.getTimescaleDatabase(),
      username: this.getTimescaleUsername(),
      password: this.getTimescalePassword(),
    };
  }

  getIsPublicApiFeatureActive(): boolean {
    const isApiActive = this.configService.get<boolean>('features.publicApi.enabled');
    if (isApiActive === undefined) {
      throw new Error('No public api feature flag present');
    }

    return isApiActive;
  }

  getPublicApiFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.publicApi.port');
    if (featurePort === undefined) {
      throw new Error('No public api port present');
    }

    return featurePort;
  }

  getIsPrivateApiFeatureActive(): boolean {
    const isApiActive = this.configService.get<boolean>('features.privateApi.enabled');
    if (isApiActive === undefined) {
      throw new Error('No private api feature flag present');
    }

    return isApiActive;
  }

  getPrivateApiFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.privateApi.port');
    if (featurePort === undefined) {
      throw new Error('No private api port present');
    }

    return featurePort;
  }

  getIsCacheWarmerFeatureActive(): boolean {
    const isCacheWarmerActive = this.configService.get<boolean>('features.cacheWarmer.enabled');
    if (isCacheWarmerActive === undefined) {
      throw new Error('No cache warmer feature flag present');
    }

    return isCacheWarmerActive;
  }

  getCacheWarmerFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.cacheWarmer.port');
    if (featurePort === undefined) {
      throw new Error('No cache warmer port present');
    }

    return featurePort;
  }

  getIsDataIngesterFeatureActive(): boolean {
    const isDataIngesterActive = this.configService.get<boolean>('features.dataIngester.enabled');
    if (isDataIngesterActive === undefined) {
      throw new Error('No data ingester feature flag present');
    }

    return isDataIngesterActive;
  }

  getDataIngesterFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.dataIngester.port');
    if (featurePort === undefined) {
      throw new Error('No data ingester port present');
    }

    return featurePort;
  }

  getIsTransactionProcessorFeatureActive(): boolean {
    const isTransactionProcessorActive = this.configService.get<boolean>('features.transactionProcessor.enabled');
    if (isTransactionProcessorActive === undefined) {
      throw new Error('No transaction processor feature flag present');
    }

    return isTransactionProcessorActive;
  }

  getTransactionProcessorFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.transactionProcessor.port');
    if (featurePort === undefined) {
      throw new Error('No transaction processor port present');
    }

    return featurePort;
  }

  getTransactionProcessorMaxLookBehind(): number {
    const maxLookBehind = this.configService.get<number>('features.transactionProcessor.maxLookBehind');
    if (maxLookBehind === undefined) {
      throw new Error('No transaction processor max look behind present');
    }

    return maxLookBehind;
  }

  getIsQueueWorkerFeatureActive(): boolean {
    const isQueueWorkerActive = this.configService.get<boolean>('features.queueWorker.enabled');
    if (isQueueWorkerActive === undefined) {
      throw new Error('No queue worker feature flag present');
    }

    return isQueueWorkerActive;
  }

  getQueueWorkerFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.queueWorker.port');
    if (featurePort === undefined) {
      throw new Error('No transaction processor port present');
    }

    return featurePort;
  }

  getJwtSecret(): string {
    const jwtSecret = this.configService.get<string>('security.jwtSecret');
    if (!jwtSecret) {
      throw new Error('No jwtSecret present');
    }

    return jwtSecret;
  }

  getSecurityAdmins(): string[] {
    const admins = this.configService.get<string[]>('security.admins');
    if (admins === undefined) {
      throw new Error('No security admins value present');
    }

    return admins;
  }

  getDelegationContract(): string {
    const delegationContract = this.configService.get<string>('contracts.delegation');
    if (!delegationContract) {
      throw new Error('No delegation contract present');
    }

    return delegationContract;
  }

  getAuctionContract(): string {
    const auctionContract = this.configService.get<string>('contracts.auction');
    if (!auctionContract) {
      throw new Error('No auction contract present');
    }

    return auctionContract;
  }

  getStakingContract(): string {
    const stakingContract = this.configService.get<string>('contracts.staking');
    if (!stakingContract) {
      throw new Error('No staking contract present');
    }

    return stakingContract;
  }

  getExchangeWallets(): Record<string, string[]> {
    const exchangeWallets = this.configService.get<Record<string, string[]>>('exchangeWallets');
    if (exchangeWallets === undefined) {
      throw new Error('No exchange wallets value present');
    }

    return exchangeWallets;
  }

  getGithubAccessToken(): string {
    const githubAccessToken = this.configService.get<string>('github.accessToken');
    if (!githubAccessToken) {
      throw new Error('No github access token value present');
    }

    return githubAccessToken;
  }

  getFeaturedRepositories(): string[] {
    const featuredRepositories = this.configService.get<string[]>('github.featuredRepositories');
    if (!featuredRepositories) {
      throw new Error('No featured repositories value present');
    }

    return featuredRepositories;
  }

  getCoinMarketCapAccessToken(): string {
    const accessToken = this.configService.get<string>('coinmarketcap.accessToken');
    if (!accessToken) {
      throw new Error('No coinmarketcap access token value present');
    }

    return accessToken;
  }

  getCoingeckoUrl(): string {
    const url = this.configService.get<string>('coingecko.url');
    if (!url) {
      throw new Error('No Coingecko url value present');
    }
    return url;
  }

  getCoingeckoElrondId(): string {
    const elrondId = this.configService.get<string>('coingecko.elrondId');
    if (!elrondId) {
      throw new Error('No Coingecko Elrond Id value present');
    }
    return elrondId;
  }

  getCoingeckoVsCurrencies(): string[] {
    const vsCurrencies = this.configService.get<string[]>('coingecko.vsCurrencies');
    if (!vsCurrencies) {
      throw new Error('No Coingecko vs currencies value present');
    }
    return vsCurrencies;
  }
}
