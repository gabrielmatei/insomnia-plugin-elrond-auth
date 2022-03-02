import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { PricesEntity } from "./prices.entity";

export class PricesIngest implements Ingest {
  public readonly name = PricesIngest.name;
  public readonly entityTarget = PricesEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<PricesEntity[]> {
    const elrondId = this.apiConfigService.getCoingeckoElrondId();
    const vsCurrencies = this.apiConfigService.getCoingeckoVsCurrencies();

    const prices: Record<string, number> = {};
    await Promise.all(vsCurrencies.map(async (currency) => {
      const [
        { current_price },
      ] = await this.apiService.get(`${this.apiConfigService.getCoingeckoUrl()}/coins/markets?vs_currency=${currency}&ids=${elrondId}`);

      prices[currency] = current_price;
    }));

    const [
      { market_cap, high_24h },
    ] = await this.apiService.get(`${this.apiConfigService.getCoingeckoUrl()}/coins/markets?vs_currency=usd&ids=${elrondId}`);

    const timestamp = moment().utc().toDate();
    return PricesEntity.fromRecord(timestamp, {
      ...prices,
      high_24h,
      market_cap,
    });
  }
}
