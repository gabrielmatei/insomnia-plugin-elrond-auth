import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "./ingest";

export class AccountsCountIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<Record<string, number>> {
    const count = await this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts');

    return {
      count,
      // count_24h, // TODO
    };
  }
}
