import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { AccountsCount } from "./accounts-count.entity";

export class AccountsCountIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly timescaleService: TimescaleService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, timescaleService: TimescaleService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.timescaleService = timescaleService;
  }

  public async fetch(): Promise<AccountsCount[]> {
    const timestamp = moment().utc().toDate();

    const count = await this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts');

    const previousResult24h = await this.timescaleService.getPreviousValue24h(AccountsCount, timestamp, 'count');
    const count24h = previousResult24h && previousResult24h.value > 0 ? count - previousResult24h.value : 0;

    return AccountsCount.fromRecord(timestamp, {
      count,
      count_24h: count24h,
    });
  }
}
