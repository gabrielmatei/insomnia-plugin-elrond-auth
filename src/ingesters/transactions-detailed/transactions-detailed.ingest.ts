import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { TransactionsDetailedEntity } from "./transactions-detailed.entity";
import BigNumber from "bignumber.js";
import { Injectable } from "@nestjs/common";
import { GatewayService } from "src/common/gateway/gateway.service";

@Injectable()
export class TransactionsDetailedIngest implements Ingest {
  public readonly name = TransactionsDetailedIngest.name;
  public readonly entityTarget = TransactionsDetailedEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly gatewayService: GatewayService,
  ) { }

  public async fetch(): Promise<TransactionsDetailedEntity[]> {
    const timestamp = moment().utc();
    const timestamp24hAgo = moment(timestamp).add(-1, 'days');

    let valueMoved = new BigNumber(0);
    let totalFees = new BigNumber(0);
    const computeTransactionsPage = async (transactions: any[]) => {
      for (const transaction of transactions) {
        valueMoved = valueMoved.plus(new BigNumber(transaction.value?.length > 0 ? transaction.value : '0'));
        totalFees = totalFees.plus(new BigNumber(transaction.fee?.length > 0 ? transaction.fee : '0'));
      }
    };

    const elasticQuery = ElasticQuery.create()
      .withPagination({ size: 10000 })
      .withFilter([
        new RangeQuery('timestamp', {
          gte: timestamp24hAgo.unix(),
          lt: timestamp.unix(),
        }),
      ]);
    await this.elasticService.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, computeTransactionsPage);

    const rewardsPerEpoch = await this.getCurrentRewardsPerEpoch();
    const newEmission = new BigNumber(rewardsPerEpoch).shiftedBy(18).minus(new BigNumber(totalFees));

    const valueMovedFormatted = valueMoved.shiftedBy(-18).toNumber();
    const totalFeesFormatted = totalFees.shiftedBy(-18).toNumber();
    const newEmissionFormatted = newEmission.shiftedBy(-18).toNumber();

    return TransactionsDetailedEntity.fromRecord(timestamp.toDate(), {
      value_moved: valueMovedFormatted,
      total_fees: totalFeesFormatted,
      new_emission: newEmissionFormatted,
    });
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
