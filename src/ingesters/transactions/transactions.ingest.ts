import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/ingester";
import { Transactions } from "./transactions.entity";

export class TransactionsIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<Transactions[]> {
    const gte = moment().startOf('day').subtract(1, 'day').unix();
    const lt = moment().startOf('day').unix();

    const [
      count,
      count_24h,
    ] = await Promise.all([
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'transactions'),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        'transactions',
        ElasticQuery.create().withFilter([
          new RangeQuery('timestamp', { gte, lt }),
        ])),
    ]);

    const timestamp = moment().utc().toDate();
    return Transactions.fromRecord(timestamp, {
      count,
      count_24h,
    });
  }
}
