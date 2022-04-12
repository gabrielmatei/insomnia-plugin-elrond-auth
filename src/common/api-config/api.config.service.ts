import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) { }

  getGlobalPrefix(): string {
    const globalPrefix = this.configService.get<string>('globalPrefix') ?? '';
    return globalPrefix;
  }

  getApiUrl(): string {
    const apiUrl = this.configService.get<string>('urls.api');
    if (!apiUrl) {
      throw new Error('No API url present');
    }

    return apiUrl;
  }

  getMaiarApiUrl(): string {
    const maiarUrl = this.configService.get<string>('urls.maiar');
    if (!maiarUrl) {
      throw new Error('No Maiar API url present');
    }

    return maiarUrl;
  }

  getMaiarDexUrl(): string {
    const maiarDexUrl = this.configService.get<string>('urls.maiarDex');
    if (!maiarDexUrl) {
      throw new Error('No MaiarDex url present');
    }

    return maiarDexUrl;
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

  isEventsNotifierFeatureActive(): boolean {
    const isEventsNotifierActive = this.configService.get<boolean>('features.eventsNotifier.enabled');
    if (isEventsNotifierActive === undefined) {
      return false;
    }

    return isEventsNotifierActive;
  }

  getEventsNotifierFeaturePort(): number {
    const eventsNotifierPort = this.configService.get<number>('features.eventsNotifier.port');
    if (eventsNotifierPort === undefined) {
      throw new Error('No events notifier port present');
    }

    return eventsNotifierPort;
  }

  getEventsNotifierUrl(): string {
    const url = this.configService.get<string>('features.eventsNotifier.url');
    if (!url) {
      throw new Error('No events notifier url present');
    }

    return url;
  }

  getEventsNotifierExchange(): string {
    const exchange = this.configService.get<string>('features.eventsNotifier.exchange');
    if (!exchange) {
      throw new Error('No events notifier exchange present');
    }

    return exchange;
  }

  getRateLimiterSecret(): string | undefined {
    return this.configService.get<string>('rateLimiterSecret');
  }

  getUseKeepAliveAgentFlag(): boolean {
    return this.configService.get<boolean>('flags.useKeepAliveAgent') ?? true;
  }

  getAxiosTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.downstream') ?? 61000;
  }

  getServerTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.upstream') ?? 60000;
  }

  getHeadersTimeout(): number {
    return this.getServerTimeout() + 1000;
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

  getFeaturedGithubRepositories(): string[] {
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

  getInflationAmounts(): number[] {
    const inflationAmounts = this.configService.get<number[]>('inflation');
    if (!inflationAmounts) {
      throw new Error('No inflation amounts present');
    }

    return inflationAmounts;
  }

  getTwitterUrl(): string[] {
    const authorizationBearers = this.configService.get<string[]>('twitter.url');
    if (!authorizationBearers) {
      throw new Error('No Twitter url value present');
    }
    return authorizationBearers;
  }

  getTwitterAuthorizationBearers(): string[] {
    const authorizationBearers = this.configService.get<string[]>('twitter.authorizationBearers');
    if (!authorizationBearers) {
      throw new Error('No Twitter authorization bearers value present');
    }
    return authorizationBearers;
  }

  getAWSAccessKeyId(): string {
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    if (accessKeyId === undefined) {
      throw new Error('No AWS accessKeyId value present');
    }

    return accessKeyId;
  }

  getAWSSecretAccessKey(): string {
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');
    if (secretAccessKey === undefined) {
      throw new Error('No AWS secretAccessKey value present');
    }

    return secretAccessKey;
  }

  getAWSRegion(): string {
    const region = this.configService.get<string>('aws.region');
    if (region === undefined) {
      throw new Error('No AWS region value present');
    }

    return region;
  }

  getAWSTimestreamDatabase(): string {
    const databaseName = this.configService.get<string>('aws.timestream.databaseName');
    if (databaseName === undefined) {
      throw new Error('No AWS Timestream database value present');
    }

    return databaseName;
  }

  getAWSTimestreamTable(): string {
    const tableName = this.configService.get<string>('aws.timestream.tableName');
    if (tableName === undefined) {
      throw new Error('No AWS Timestream table name value present');
    }

    return tableName;
  }

  getMexIdentifier(): string {
    const identifier = this.configService.get<string>('maiarDex.mexIdentifier');
    if (!identifier) {
      throw new Error('No MEX identifier present');
    }

    return identifier;
  }
}
