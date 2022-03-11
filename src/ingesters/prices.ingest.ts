import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { PricesEntity } from "src/common/timescale/entities/prices.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class PricesIngest implements Ingest {
  public readonly name = PricesIngest.name;
  public readonly entityTarget = PricesEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const elrondId = this.apiConfigService.getCoingeckoElrondId();
    const vsCurrencies = this.apiConfigService.getCoingeckoVsCurrencies();

    const prices: any = {};
    await Promise.all(vsCurrencies.map(async (currency) => {
      const [
        { current_price, market_cap, high_24h },
      ] = await this.apiService.get(`${this.apiConfigService.getCoingeckoUrl()}/coins/markets?vs_currency=${currency}&ids=${elrondId}`);

      prices[currency] = {
        current_price,
        market_cap,
        high_24h,
      };
    }));

    return {
      current: {
        entity: PricesEntity,
        records: PricesEntity.fromObject(timestamp, prices),
      },
    };
  }
}