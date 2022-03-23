import { Injectable } from "@nestjs/common";
import BigNumber from "bignumber.js";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { MatchQuery } from "src/common/elastic/entities/match.query";
import { RangeQuery, RangeQueryOptions } from "src/common/elastic/entities/range.query";
import { TermsQuery } from "src/common/elastic/entities/terms.query";
import { ExchangesHistoricalEntity } from "src/common/timescale/entities/exchanges-historical.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";

@Injectable()
export class ExchangesDetailedIngest implements Ingest {
  public readonly name = ExchangesDetailedIngest.name;
  public readonly entityTarget = ExchangesHistoricalEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<IngestRecords[]> {
    const timestamp = moment.utc().startOf('day');
    const timestamp24hAgo = moment(timestamp).add(-1, 'days');

    const timestampFilter = {
      gte: timestamp24hAgo.unix(),
      lt: timestamp.unix(),
    };

    const exchangeWallets = this.apiConfigService.getExchangeWallets();

    const exchanges: Record<string, { total: number, inflows: number, outflows: number }> = {};
    await Promise.all(
      Object
        .entries(exchangeWallets)
        .map(async ([exchange, wallets]) => {
          const inflows = await this.getExchangeFlows(wallets, timestampFilter, 'in');
          const outflows = await this.getExchangeFlows(wallets, timestampFilter, 'out');

          exchanges[exchange] = {
            total: inflows + outflows,
            inflows,
            outflows,
          };
        })
    );

    return [{
      entity: ExchangesHistoricalEntity,
      records: ExchangesHistoricalEntity.fromObject(timestamp.toDate(), exchanges),
    }];
  }

  private async getExchangeFlows(wallets: string[], range: RangeQueryOptions, direction: 'in' | 'out'): Promise<number> {
    let totalValue = new BigNumber(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line require-await
    const computeTransactionsPage = async (_index: number, transactions: any[]) => {
      for (const transaction of transactions) {
        totalValue = totalValue.plus(new BigNumber(transaction.value));
      }
    };

    const elasticQuery = ElasticQuery.create()
      .withFields(['value'])
      .withPagination({ size: 10000 })
      .withFilter([
        new MatchQuery('status', 'success'),
        new RangeQuery('timestamp', range),
        new TermsQuery(direction === 'in' ? 'receiver' : 'sender', wallets),
      ]);
    await this.elasticService.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, computeTransactionsPage);

    const totalValueFormatted = totalValue.shiftedBy(-18).toNumber();
    return totalValueFormatted;
  }
}
