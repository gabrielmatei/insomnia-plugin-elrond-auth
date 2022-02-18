import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { GatewayService } from "src/common/gateway/gateway.service";
import { Ingest } from "./ingest";

export class AccountsTotalBalanceWithStakeIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<Record<string, number>> {
    const epoch = await this.gatewayService.getEpoch();

    const [
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await Promise.all([
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 0.1 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 1 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 10 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 100 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 1000 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalBalanceWithStakeNum', { gt: 10000 }),
        ])),
    ]);

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
