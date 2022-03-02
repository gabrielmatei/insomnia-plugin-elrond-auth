import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { CachingService } from "src/common/caching/caching.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { ActiveUsersEntity } from "./active-users.entity";

export class ActiveUsersIngest implements Ingest {
  public readonly name = ActiveUsersIngest.name;
  public readonly entityTarget = ActiveUsersEntity;

  public static readonly SET_KEY = "activeUserSet";

  private readonly apiConfigService: ApiConfigService;
  private readonly elasticService: ElasticService;
  private readonly cachingService: CachingService;

  constructor(apiConfigService: ApiConfigService, elasticService: ElasticService, cachingService: CachingService) {
    this.apiConfigService = apiConfigService;
    this.elasticService = elasticService;
    this.cachingService = cachingService;
  }

  public async fetch(): Promise<ActiveUsersEntity[]> {
    const timestamp = moment().utc();
    const timestamp24hAgo = moment(timestamp).add(-1, 'days');

    // TODO scroll
    const from = 0;
    const size = 500;

    const elasticQuery = ElasticQuery.create()
      .withFields(['sender'])
      .withPagination({ from, size })
      .withFilter([new RangeQuery('timestamp', {
        gte: timestamp24hAgo.unix(),
        lt: timestamp.unix(),
      })]);

    const transactions = await this.elasticService.getList(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery);

    await this.cachingService.delCache(ActiveUsersIngest.SET_KEY);
    for (const transaction of transactions) {
      await this.cachingService.addInSet(ActiveUsersIngest.SET_KEY, transaction.sender);
    }

    const activeUsers = await this.cachingService.getSetMembersCount(ActiveUsersIngest.SET_KEY);
    await this.cachingService.delCache(ActiveUsersIngest.SET_KEY);

    return ActiveUsersEntity.fromRecord(timestamp.toDate(), {
      count: activeUsers,
    });
  }
}
