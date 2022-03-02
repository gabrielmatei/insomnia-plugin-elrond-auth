import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { ActiveUsersEntity } from "./active-users.entity";

export class ActiveUsersIngest implements Ingest {
  public readonly name = ActiveUsersIngest.name;
  public readonly entityTarget = ActiveUsersEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<ActiveUsersEntity[]> {
    const timestamp = moment().utc().toDate();

    console.log(this.apiConfigService, this.elasticService);

    return ActiveUsersEntity.fromRecord(timestamp, {
    });
  }
}
