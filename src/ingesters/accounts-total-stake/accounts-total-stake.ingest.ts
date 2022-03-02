import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AccountsTotalStakeEntity } from "./accounts-total-stake.entity";

export class AccountsTotalStakeIngest implements Ingest {
  public readonly name = AccountsTotalStakeIngest.name;
  public readonly entityTarget = AccountsTotalStakeEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<AccountsTotalStakeEntity[]> {
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
      'totalStakeNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const timestamp = moment().utc().toDate();
    return AccountsTotalStakeEntity.fromRecord(timestamp, {
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
