import { Injectable, Logger } from "@nestjs/common";
import BigNumber from "bignumber.js";
import { ApiConfigService } from "../api-config/api.config.service";
import { AWSTimestreamService } from "../aws/aws.timestream.service";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { ApiService } from "../network/api.service";
import { Pair } from "./entities/pair";
import { Pool } from "./entities/pool";
import { getPairsQuery, getTotalValueLockedQuery } from "./maiar-dex.queries";

@Injectable()
export class MaiarDexService {
  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly cachingService: CachingService,
    private readonly timestreamService: AWSTimestreamService,
  ) {
    this.logger = new Logger(MaiarDexService.name);
  }

  public async getAllPairs(): Promise<Pair[]> {
    return await this.cachingService.getOrSetCache(
      CacheInfo.MaiarDexPairs.key,
      async () => await this.getAllPairsRaw(),
      CacheInfo.MaiarDexPairs.ttl
    );
  }

  private async getAllPairsRaw(): Promise<Pair[]> {
    // TODO maiar-dex pagination bug
    try {
      let offset = 0;
      const limit = 100;

      const allActivePairs: Pair[] = [];

      let currentPairs = [];
      do {
        const query = getPairsQuery(offset, limit);
        currentPairs = await this.apiService
          .post(this.apiConfigService.getMaiarDexUrl(), { query })
          .then((response: any) => response.data?.pairs ?? []);

        const activePairs = currentPairs
          .filter((pair: any) => pair.state === 'Active');

        for (const pair of activePairs) {
          allActivePairs.push(pair);
        }

        offset += limit;
      } while (currentPairs.length > 0);

      return allActivePairs;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when fetching pairs`);
      this.logger.error(error);

      return [];
    }
  }

  public async getPools(startDate: Date, endDate: Date): Promise<Pool[]> {
    const pairs = await this.getAllPairs();
    const pools = await this.timestreamService.getPoolVolumes(pairs, startDate, endDate);

    return pools;
  }

  public async getTotalValueLocked(): Promise<number> {
    try {
      const { totalValueLockedUSD } = await this.apiService.post(this.apiConfigService.getMaiarDexUrl(), {
        query: getTotalValueLockedQuery(),
      }).then((response: any) => response.data);

      const totalValueLocked = new BigNumber(totalValueLockedUSD).toNumber();
      return totalValueLocked;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when fetching totalValueLockedUSD`);
      this.logger.error(error);
      return 0;
    }
  }

  public async getTokenBurntVolume(tokenIdentifier: string, startDate: Date, endDate: Date): Promise<number> {
    const volume = await this.timestreamService.getTokenBurntVolume(tokenIdentifier, startDate, endDate);
    return volume;
  }

  public async getTotalVolume(startDate: Date, endDate: Date): Promise<number> {
    const pairs = await this.getAllPairs();
    const totalVolume = await this.timestreamService.getTotalVolume(pairs, startDate, endDate);
    return totalVolume;
  }
}
