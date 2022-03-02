import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AccountsBalanceEntity } from "./accounts-balance.entity";

@Injectable()
export class AccountsBalanceIngest implements Ingest {
  public readonly name = AccountsBalanceIngest.name;
  public readonly entityTarget = AccountsBalanceEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<AccountsBalanceEntity[]> {
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

    const timestamp = moment().utc().toDate();
    return AccountsBalanceEntity.fromRecord(timestamp, {
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
