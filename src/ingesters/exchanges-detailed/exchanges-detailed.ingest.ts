import BigNumber from "bignumber.js";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery, RangeQueryOptions } from "src/common/elastic/entities/range.query";
import { TermsQuery } from "src/common/elastic/entities/terms.query";
import { Ingest } from "src/crons/data-ingester/ingester";
import { ExchangesDetailedEntity } from "./exchanges-detailed.entity";

export class ExchangesDetailedIngest implements Ingest {
  public readonly name = ExchangesDetailedIngest.name;
  public readonly entityTarget = ExchangesDetailedEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<ExchangesDetailedEntity[]> {
    const timestamp = moment().utc();
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

    return ExchangesDetailedEntity.fromObject(timestamp.toDate(), exchanges);
  }

  private async getExchangeFlows(wallets: string[], range: RangeQueryOptions, direction: 'in' | 'out'): Promise<number> {
    let totalValue = new BigNumber(0);

    // TODO scroll
    const from = 0;
    const size = 500;

    const elasticQuery = ElasticQuery.create()
      .withPagination({ from, size })
      .withFilter([
        new RangeQuery('timestamp', range),
        new TermsQuery(direction === 'in' ? 'receiver' : 'sender', wallets),
      ]);

    const transactions = await this.elasticService.getList(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery);
    for (const transaction of transactions) {
      totalValue = totalValue.plus(new BigNumber(transaction.value));
    }

    const totalValueFormatted = totalValue.shiftedBy(-18).toNumber();
    return totalValueFormatted;
  }
}
