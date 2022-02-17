import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "./ingest";

export class AccountsIngest implements Ingest {
  private readonly elasticService: ElasticService;

  constructor(elasticService: ElasticService) {
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<Record<string, number>> {
    const [
      count,
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await Promise.all([
      this.elasticService.getCount('accounts'),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 0 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 0.1 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 1 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 10 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 100 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 1000 }),
      ])),
      this.elasticService.getCount('accounts', ElasticQuery.create().withFilter([
        new RangeQuery('balanceNum', { gt: 10000 }),
      ])),
    ]);

    return {
      count,
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
      // count_24h, // TODO
    };
  }
}
