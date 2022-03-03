import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AccountsEntity } from "./accounts.entity";

@Injectable()
export class AccountsIngest implements Ingest {
  public readonly name = AccountsIngest.name;
  public readonly entityTarget = AccountsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<AccountsEntity[]> {
    const timestamp = moment().utc().toDate();

    const count = await this.elasticService.getCount(this.apiConfigService.getInternalElasticUrl(), 'accounts');

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
      'accounts',
      'balanceNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsEntity, timestamp, 'count', 'accounts');
    const count24h = previousResult24h && previousResult24h > 0 ? count - previousResult24h : 0;

    return AccountsEntity.fromObject(timestamp, {
      accounts: {
        count,
        count_gt_0,
        count_gt_0_1,
        count_gt_1,
        count_gt_10,
        count_gt_100,
        count_gt_1000,
        count_gt_10000,
        count_24h: count24h,
      },
    });
  }
}
