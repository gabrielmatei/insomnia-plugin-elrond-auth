import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { Economics } from "./economics.entity";

export class EconomicsIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<Economics[]> {
    const {
      totalSupply: total_supply,
      circulatingSupply: circulating_supply,
      staked,
    } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const timestamp = moment().utc().toDate();
    return Economics.fromRecord(timestamp, {
      total_supply,
      circulating_supply,
      floating_supply: circulating_supply - staked,
      staked,
    }, 'economics');

  }
}
