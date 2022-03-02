import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { TransactionsDetailedEntity } from "./transactions-detailed.entity";
import BigNumber from "bignumber.js";

export class TransactionsDetailedIngest implements Ingest {
  public readonly name = TransactionsDetailedIngest.name;
  public readonly entityTarget = TransactionsDetailedEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
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

    const valueMovedFormatted = valueMoved.shiftedBy(-18).toNumber();
    const totalFeesFormatted = totalFees.shiftedBy(-18).toNumber();

    return TransactionsDetailedEntity.fromRecord(timestamp.toDate(), {
      value_moved: valueMovedFormatted,
      total_fees: totalFeesFormatted,
    });
  }
}
