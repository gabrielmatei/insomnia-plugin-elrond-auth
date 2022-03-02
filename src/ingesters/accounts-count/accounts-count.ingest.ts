import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AccountsCountEntity } from "./accounts-count.entity";
@Injectable()
export class AccountsCountIngest implements Ingest {
  public readonly name = AccountsCountIngest.name;
  public readonly entityTarget = AccountsCountEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly timescaleService: TimescaleService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, timescaleService: TimescaleService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.timescaleService = timescaleService;
  }

  public async fetch(): Promise<AccountsCountEntity[]> {
    const timestamp = moment().utc().toDate();

    const count = await this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts');

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsCountEntity, timestamp, 'count');
    const count24h = previousResult24h && previousResult24h.value > 0 ? count - previousResult24h.value : 0;

    return AccountsCountEntity.fromRecord(timestamp, {
      count,
      count_24h: count24h,
    });
  }
}
