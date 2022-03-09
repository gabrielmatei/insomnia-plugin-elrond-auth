import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheWarmerService {
  // constructor(
  //   private readonly cachingService: CachingService,
  //   @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  //   private readonly githubService: GithubService,
  // ) { }

  // @Cron(CronExpression.EVERY_HOUR)
  // async handleRepositoriesInvalidations() {
  //   await Locker.lock('Repositories invalidations', async () => {
  //     const organization = 'ElrondNetwork';
  //     const repositories = await this.githubService.getRepositoriesRaw(organization);

  //     await this.invalidateKey(
  //       CacheInfo.Repositories(organization).key,
  //       repositories,
  //       CacheInfo.Repositories(organization).ttl
  //     );
  //   }, true);
  // }

  // private async invalidateKey<T>(key: string, data: T, ttl: number) {
  //   await Promise.all([
  //     this.cachingService.setCache(key, data, ttl),
  //     this.deleteCacheKey(key),
  //   ]);
  // }

  // private async deleteCacheKey(key: string) {
  //   await this.clientProxy.emit('deleteCacheKeys', [key]);
  // }
}
