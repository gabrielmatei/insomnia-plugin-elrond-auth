import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "./ingest";

export class AccountsBalanceIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<Record<string, number>> {
    const [
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await this.elasticService.getDetailedRangeCount(
      this.apiConfigService.getElasticUrl(),
      'accounts',
      'balanceNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    return {
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
      // count_24h, // TODO
    };
  }
}
