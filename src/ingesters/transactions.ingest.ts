import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { ApiService } from "src/common/network/api.service";
import { TransactionsHistoricalBackupEntity } from "src/common/timescale/entities/transactions-historical-backup.entity";
import { TransactionsHistoricalEntity } from "src/common/timescale/entities/transactions-historical.entity";
import { TransactionsEntity } from "src/common/timescale/entities/transactions.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class TransactionsIngest implements Ingest {
  public readonly name = TransactionsIngest.name;
  public readonly entityTarget = TransactionsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const startDate = moment.utc().startOf('day').subtract(1, 'day');
    const endDate = moment.utc().startOf('day');

    const [
      transactionsCount,
      transactionsCount24h,
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

    const [
      tokensCount,
      nftsCount,
      previousTokensCountResult24h,
      previousNftsCountResult24h,
    ] = await Promise.all([
      this.apiService.get<number>(`${this.apiConfigService.getApiUrl()}/tokens/count`),
      this.apiService.get<number>(`${this.apiConfigService.getApiUrl()}/nfts/count?type=SemiFungibleESDT,NonFungibleESDT&hasUris=true`),
      this.timescaleService.getPreviousValue24h(TransactionsEntity, endDate.toDate(), 'count', 'tokens'),
      this.timescaleService.getPreviousValue24h(TransactionsEntity, endDate.toDate(), 'count', 'nfts'),
    ]);

    const tokensCount24h = previousTokensCountResult24h && previousTokensCountResult24h > 0 ? tokensCount - previousTokensCountResult24h : 0;
    const nftsCount24h = previousNftsCountResult24h && previousNftsCountResult24h > 0 ? nftsCount - previousNftsCountResult24h : 0;

    const data = {
      tokens: {
        count: tokensCount,
        count_24h: tokensCount24h,
      },
      nfts: {
        count: nftsCount,
        count_24h: nftsCount24h,
      },
      transactions: {
        count: transactionsCount,
        count_24h: transactionsCount24h,
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
