import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AccountsCountEntity } from "./accounts-count.entity";
@Injectable()
export class AccountsCountIngest implements Ingest {
  public readonly name = AccountsCountIngest.name;
  public readonly entityTarget = AccountsCountEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly gatewayService: GatewayService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<AccountsCountEntity[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment().utc().toDate();

    const count = await this.elasticService.getCount(this.apiConfigService.getInternalElasticUrl(), `accounts-000001_${epoch}`);

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsCountEntity, timestamp, 'count');
    const count24h = previousResult24h && previousResult24h > 0 ? count - previousResult24h : 0;

    return AccountsCountEntity.fromRecord(timestamp, {
      count,
      count_24h: count24h,
    });
  }
}
