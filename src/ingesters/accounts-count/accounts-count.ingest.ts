import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest";
import { AccountsCount } from "./accounts-count.entity";

export class AccountsCountIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<AccountsCount[]> {

    const count = await this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts');

    const timestamp = moment().utc().toDate();
    return AccountsCount.fromRecord(timestamp, {
      count,
    });
  }
}
