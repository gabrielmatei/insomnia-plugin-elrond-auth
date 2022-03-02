import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { QuotesEntity } from "./quotes.entity";

export class QuotesIngest implements Ingest {
  public readonly name = QuotesIngest.name;
  public readonly entityTarget = QuotesEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<QuotesEntity[]> {
    const { data: quotesRaw } = await this.apiService.get<any>(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params: {
          symbol: 'EGLD,BTC,ETH,BNB,BUSD,USDC',
        },
        headers: {
          'X-CMC_PRO_API_KEY': this.apiConfigService.getCoinMarketCapAccessToken(),
        },
      });

    const data: any = {};
    Object.entries(quotesRaw).map(([key, value]: [string, any]) => {
      const { price, market_cap, volume_24h } = value.quote.USD;

      const series = key.toLocaleLowerCase();
      data[series] = {
        price,
        market_cap,
        volume_24h,
      };
    });

    const timestamp = moment().utc().toDate();
    return QuotesEntity.fromObject(timestamp, data);
  }
}
