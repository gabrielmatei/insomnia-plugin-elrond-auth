import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class AccountsBalanceIngest implements Ingest {
  public readonly name = AccountsBalanceIngest.name;
  public readonly entityTarget = AccountsHistoricalEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly gatewayService: GatewayService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment.utc().startOf('day').subtract(1, 'days').toDate();

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
      `accounts-000001_${epoch}`,
      'balanceNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsHistoricalEntity, timestamp, 'count_gt_0', 'balance');
    const count24h = previousResult24h && previousResult24h > 0 ? count_gt_0 - previousResult24h : 0;

    const data = {
      balance: {
        count_gt_0,
        count_gt_0_1,
        count_gt_1,
        count_gt_10,
        count_gt_100,
        count_gt_1000,
        count_gt_10000,
        count_24h: count24h,
      },
    };
    return {
      historical: {
        entity: AccountsHistoricalEntity,
        records: AccountsHistoricalEntity.fromObject(timestamp, data),
      },
    };
  }
}