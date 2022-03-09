import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { TransactionsHistoricalBackupEntity } from "src/common/timescale/entities/transactions-historical-backup.entity";
import { TransactionsHistoricalEntity } from "src/common/timescale/entities/transactions-historical.entity";
import { TransactionsEntity } from "src/common/timescale/entities/transactions.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class TransactionsIngest implements Ingest {
  public readonly name = TransactionsIngest.name;
  public readonly entityTarget = TransactionsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const startDate = moment.utc().startOf('day').subtract(1, 'day');
    const endDate = moment.utc().startOf('day');

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

    const data = {
      transactions: {
        count,
        count_24h,
      },
    };
    return {
      current: {
        entity: TransactionsEntity,
        records: TransactionsEntity.fromObject(startDate.toDate(), data),
      },
      historical: {
        entity: TransactionsHistoricalEntity,
        records: TransactionsHistoricalEntity.fromObject(startDate.toDate(), data),
      },
      backup: {
        entity: TransactionsHistoricalBackupEntity,
        records: TransactionsHistoricalBackupEntity.fromObject(startDate.toDate(), data),
      },
    };
  }
}
