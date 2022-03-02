import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { AccountsTotalBalanceWithStakeEntity } from "./accounts-total-balance-with-stake.entity";

export class AccountsTotalBalanceWithStakeIngest implements Ingest {
  public readonly name = AccountsTotalBalanceWithStakeIngest.name;
  public readonly entityTarget = AccountsTotalBalanceWithStakeEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<AccountsTotalBalanceWithStakeEntity[]> {
    const epoch = await this.gatewayService.getEpoch();

    const [
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await this.elasticService.getDetailedRangeCount(
      this.apiConfigService.getInternalElasticUrl(),
      `accounts-000001_${epoch}`,
      'totalBalanceWithStakeNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const timestamp = moment().utc().toDate();
    return AccountsTotalBalanceWithStakeEntity.fromRecord(timestamp, {
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    });
  }
}
