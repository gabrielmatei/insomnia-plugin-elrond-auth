import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { EconomicsEntity } from "./economics.entity";

export class EconomicsIngest implements Ingest {
  public readonly name = EconomicsIngest.name;
  public readonly entityTarget = EconomicsEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<EconomicsEntity[]> {
    const {
      totalSupply,
      circulatingSupply,
      staked,
    } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const numAccounts = await this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts');

    const floatingSupply = circulatingSupply - staked;
    const leftPerUser = floatingSupply / numAccounts;

    const timestamp = moment().utc().toDate();
    return EconomicsEntity.fromRecord(timestamp, {
      total_supply: totalSupply,
      circulating_supply: circulatingSupply,
      floating_supply: floatingSupply,
      staked,
      left_per_user: leftPerUser,
    });

  }
}
