import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";

export class EconomicsIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<GenericIngestEntity[]> {
    const {
      totalSupply: total_supply,
      circulatingSupply: circulating_supply,
      staked,
    } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const data = {
      economics: {
        total_supply,
        circulating_supply,
        floating_supply: circulating_supply - staked,
        staked,
      },
    };
    console.log(data);

    return [];

  }
}
