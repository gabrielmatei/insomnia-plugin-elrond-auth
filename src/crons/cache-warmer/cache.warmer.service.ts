import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CachingService } from "src/common/caching/caching.service";
import { CacheInfo } from "src/common/caching/entities/cache.info";
import { GithubService } from "src/common/github/github.service";
import { EsdtToken } from "src/common/maiar-dex/entities/pair";
import { MaiarDexService } from "src/common/maiar-dex/maiar-dex.service";
import { Locker } from "src/utils/locker";
@Injectable()
export class CacheWarmerService {
  private readonly logger: Logger;

  constructor(
    private readonly cachingService: CachingService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
    private readonly githubService: GithubService,
    private readonly maiarDexService: MaiarDexService,
  ) {
    this.logger = new Logger(CacheWarmerService.name);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleRepositoriesInvalidations() {
    await Locker.lock('Repositories invalidations', async () => {
      const organization = 'ElrondNetwork';
      const repositories = await this.githubService.getRepositoriesRaw(organization);

      await this.invalidateKey(
        CacheInfo.Repositories(organization).key,
        repositories,
        CacheInfo.Repositories(organization).ttl
      );
    }, true);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleTokenInvalidations() {
    await Locker.lock('Token invalidations', async () => {
      const pairs = await this.maiarDexService.getAllPairsRaw();
      const tokenIdentifiers = pairs
        .map(pair => [pair.firstToken.identifier, pair.secondToken.identifier])
        .flat()
        .distinct();

      const tokens = await Promise.all(tokenIdentifiers.map(async (identifier: string) => {
        const token = await this.maiarDexService.getTokenRaw(identifier);
        return token;
      }));

      await this.invalidateKey(CacheInfo.MaiarDexPairs.key, pairs, CacheInfo.MaiarDexPairs.ttl);
      await Promise.all(tokens
        .filter((token): token is EsdtToken => !!token)
        .map(async (token) => {
          await this.invalidateKey(CacheInfo.Token(token.identifier).key, token, CacheInfo.Token(token.identifier).ttl);
        }));
    }, true);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async logMemoryUsage() {
    // eslint-disable-next-line require-await
    await Locker.lock('Memory usage', async () => {
      const memoryUsageRaw = process.memoryUsage();

      const memoryUsage: Record<string, string> = {};
      Object.entries(memoryUsageRaw).map(([key, value]) => {
        const mb = (value / 1024 / 1024).toFixed(2);
        memoryUsage[key] = `${mb} MB`;
      });

      this.logger.log(`Memory usage: ${JSON.stringify(memoryUsage)}`);
    }, true);
  }

  private async invalidateKey(key: string, data: any, ttl: number) {
    await this.cachingService.setCache(key, data, ttl);
    this.refreshCacheKey(key, ttl);
  }

  private refreshCacheKey(key: string, ttl: number) {
    this.clientProxy.emit('refreshCacheKey', { key, ttl });
  }
}
