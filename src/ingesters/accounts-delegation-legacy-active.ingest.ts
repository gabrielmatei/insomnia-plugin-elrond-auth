import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { AccountsDelegationLegacyActiveEntity } from "src/common/timescale/entities/accounts-delegation-legacy-active.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";

@Injectable()
export class AccountsDelegationLegacyActiveIngest implements Ingest {
  public readonly name = AccountsDelegationLegacyActiveIngest.name;
  public readonly entityTarget = AccountsDelegationLegacyActiveEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly gatewayService: GatewayService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<AccountsDelegationLegacyActiveEntity[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment().utc().toDate();

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
      'delegationLegacyActiveNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsDelegationLegacyActiveEntity, timestamp, 'count_gt_0');
    const count24h = previousResult24h && previousResult24h > 0 ? count_gt_0 - previousResult24h : 0;

    return AccountsDelegationLegacyActiveEntity.fromRecord(timestamp, {
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
      count_24h: count24h,
    });
  }
}
