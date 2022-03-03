import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { TransactionsEntity } from "src/common/timescale/entities/transactions.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";

@Injectable()
export class TransactionsIngest implements Ingest {
  public readonly name = TransactionsIngest.name;
  public readonly entityTarget = TransactionsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
  ) { }

  public async fetch(): Promise<TransactionsEntity[]> {
    const startDate = moment().startOf('day').subtract(1, 'day');
    const endDate = moment().startOf('day');

    const [
      count,
      count_24h,
    ] = await Promise.all([
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'transactions'),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        'transactions',
        ElasticQuery.create().withFilter([
          new RangeQuery('timestamp', {
            gte: startDate.unix(),
            lt: endDate.unix(),
          }),
        ])),
    ]);

    return TransactionsEntity.fromRecord(endDate.toDate(), {
      count,
      count_24h,
    });
  }
}
