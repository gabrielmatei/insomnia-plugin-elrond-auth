import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { TransactionsDetailedEntity } from "./transactions-detailed.entity";

export class TransactionsDetailedIngest implements Ingest {
  public readonly name = TransactionsDetailedIngest.name;
  public readonly entityTarget = TransactionsDetailedEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<TransactionsDetailedEntity[]> {
    console.log(this.apiConfigService, this.elasticService);

    const timestamp = moment().utc().toDate();
    return TransactionsDetailedEntity.fromRecord(timestamp, {
    });
  }
}
