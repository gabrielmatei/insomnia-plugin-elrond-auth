import { Injectable, Logger } from "@nestjs/common";
import BigNumber from "bignumber.js";
import { ApiConfigService } from "../api-config/api.config.service";
import { AWSTimestreamService } from "../aws/aws.timestream.service";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { ApiService } from "../network/api.service";
import { Pair } from "./entities/pair";
import { Pool } from "./entities/pool";

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

  public async getPairs(): Promise<Pair[]> {
    return await this.cachingService.getOrSetCache(
      CacheInfo.MaiarDexPairs.key,
      async () => await this.getPairsRaw(),
      CacheInfo.MaiarDexPairs.ttl
    );
  }

  private async getPairsRaw(): Promise<Pair[]> {
    try {
      const { pairs } = await this.apiService.post(this.apiConfigService.getMaiarDexUrl(), {
        query: `{
          pairs {
            address
            state
            firstToken {
              identifier
              name
            }
            secondToken {
              identifier
              name
            }
          }
        }`,
      }).then((response: any) => response.data);

      const activePairs = pairs
        .filter((pair: any) => pair.state === 'Active');

      return activePairs;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when fetching pairs`);
      this.logger.error(error);
      return [];
    }
  }

  public async getPools(startDate: Date, endDate: Date): Promise<Pool[]> {
    const pairs = await this.getPairs();
    const pools = await this.timestreamService.getOrderedPools(pairs, startDate, endDate);

    return pools;
  }

  public async getTotalValueLocked(): Promise<number> {
    try {
      const { totalValueLockedUSD } = await this.apiService.post(this.apiConfigService.getMaiarDexUrl(), {
        query: `{
          totalValueLockedUSD
        }`,
      }).then((response: any) => response.data);

      const totalValueLocked = new BigNumber(totalValueLockedUSD).toNumber();
      return totalValueLocked;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when fetching totalValueLockedUSD`);
      this.logger.error(error);
      return 0;
    }
  }

  public async getTokenBurntVolume(token: string, startDate: Date, endDate: Date): Promise<number> {
    const volume = await this.timestreamService.getTokenBurntVolume(token, startDate, endDate);
    return volume;
  }

  public async getVolume(startDate: Date, endDate: Date): Promise<number> {
    const pairs = await this.getPairs();
    const volume = await this.timestreamService.getVolume(pairs, startDate, endDate);
    return volume;
  }
}
