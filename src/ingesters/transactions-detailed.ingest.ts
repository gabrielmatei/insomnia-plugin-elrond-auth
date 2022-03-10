import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import BigNumber from "bignumber.js";
import { Injectable } from "@nestjs/common";
import { GatewayService } from "src/common/gateway/gateway.service";
import { CachingService } from "src/common/caching/caching.service";
import { TransactionsDetailedEntity } from "src/common/timescale/entities/transactions-detailed.entity";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class TransactionsDetailedIngest implements Ingest {
  public static readonly ACTIVE_USERS_KEY = "activeUserSet";

  public readonly name = TransactionsDetailedIngest.name;
  public readonly entityTarget = TransactionsDetailedEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly gatewayService: GatewayService,
    private readonly cachingService: CachingService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const startDate = moment.utc().startOf('day').subtract(1, 'day');
    const endDate = moment.utc().startOf('day');

    let valueMoved = new BigNumber(0);
    let totalFees = new BigNumber(0);
    const computeTransactionsPage = async (transactions: any[]) => {
      for (const transaction of transactions) {
        await this.cachingService.addInSet(TransactionsDetailedIngest.ACTIVE_USERS_KEY, transaction.sender);

        valueMoved = valueMoved.plus(new BigNumber(transaction.value?.length > 0 ? transaction.value : '0'));
        totalFees = totalFees.plus(new BigNumber(transaction.fee?.length > 0 ? transaction.fee : '0'));
      }
    };

    const elasticQuery = ElasticQuery.create()
      .withFields(['sender', 'value', 'fee'])
      .withPagination({ size: 10000 })
      .withFilter([
        new RangeQuery('timestamp', {
          gte: startDate.unix(),
          lt: endDate.unix(),
        }),
      ]);

    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_USERS_KEY);
    await this.elasticService.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, computeTransactionsPage);

    const rewardsPerEpoch = await this.getCurrentRewardsPerEpoch();
    const newEmission = new BigNumber(rewardsPerEpoch).shiftedBy(18).minus(new BigNumber(totalFees));

    const valueMovedFormatted = valueMoved.shiftedBy(-18).toNumber();
    const totalFeesFormatted = totalFees.shiftedBy(-18).toNumber();
    const newEmissionFormatted = newEmission.shiftedBy(-18).toNumber();

    const activeUsers = await this.cachingService.getSetMembersCount(TransactionsDetailedIngest.ACTIVE_USERS_KEY);
    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_USERS_KEY);

    // TODO active token transfers

    const data = {
      users: {
        active_users: activeUsers,
      },
      transactions: {
        value_moved: valueMovedFormatted,
        total_fees: totalFeesFormatted,
        new_emission: newEmissionFormatted,
      },
    };
    return {
      historical: {
        entity: TransactionsDetailedEntity,
        records: TransactionsDetailedEntity.fromObject(startDate.toDate(), data),
      },
    };
  }

  private async getCurrentRewardsPerEpoch(): Promise<number> {
    const epoch = await this.gatewayService.getEpoch();
    const config = await this.gatewayService.getNetworkConfig();

    const epochDuration = config.roundDuration * config.roundsPerEpoch;
    const secondsInYear = 365 * 24 * 3600;
    const epochsInYear = secondsInYear / epochDuration;
    const yearIndex = Math.floor(epoch / epochsInYear);
    const inflationAmounts = this.apiConfigService.getInflationAmounts();

    if (yearIndex >= inflationAmounts.length) {
      throw new Error(
        `There is no inflation information for year with index ${yearIndex}`,
      );
    }

    const inflation = inflationAmounts[yearIndex];
    const rewardsPerEpoch = Math.max(inflation / epochsInYear, 0);
    return rewardsPerEpoch;
  }
}
