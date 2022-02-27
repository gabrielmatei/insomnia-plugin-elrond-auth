import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";

export class AccountsTotalStakeIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<GenericIngestEntity[]> {
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

    const data = {
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
      // count_24h, // TODO
    };
    console.log(data);

    return [];

  }
}
