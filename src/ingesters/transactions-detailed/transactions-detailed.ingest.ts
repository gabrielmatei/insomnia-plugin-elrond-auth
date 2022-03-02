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

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<TransactionsDetailedEntity[]> {
    const timestamp = moment().utc();
    const timestamp24hAgo = moment(timestamp).add(-1, 'days');

    // TODO store ago
    let valueMoved = new BigNumber(0);
    let totalFees = new BigNumber(0);

    let count = 0;
    let from = 0;
    const size = 500;
    do {
      const elasticQuery = ElasticQuery.create()
        .withPagination({ from, size })
        .withFilter([
          new RangeQuery('timestamp', {
            gte: timestamp24hAgo.unix(),
            lt: timestamp.unix(),
          }),
        ]);
      const transactions = await this.elasticService.getList(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery);
      for (const transaction of transactions) {
        valueMoved = valueMoved.plus(new BigNumber(transaction.value));
        totalFees = totalFees.plus(new BigNumber(transaction.fee));
      }

      from = from + size;
      count = transactions.length;
    } while (count >= size);


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

    const epochDuration = (config.roundDuration / 1000) * config.roundsPerEpoch;
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
