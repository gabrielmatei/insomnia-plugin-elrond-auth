import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { QuotesEntity } from "src/common/timescale/entities/quotes.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";

@Injectable()
export class QuotesIngest implements Ingest {
  public readonly name = QuotesIngest.name;
  public readonly entityTarget = QuotesEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) { }

  public async fetch(): Promise<QuotesEntity[]> {
    const timestamp = moment.utc().toDate();

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

    return QuotesEntity.fromObject(timestamp, data);
  }
}
