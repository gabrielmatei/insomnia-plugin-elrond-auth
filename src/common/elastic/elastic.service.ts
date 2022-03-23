/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ApiService } from "../network/api.service";
import { PerformanceProfiler } from "src/utils/performance.profiler";
import { MetricsService } from "src/common/metrics/metrics.service";
import { ElasticQuery } from "./entities/elastic.query";
import { ElasticMetricType } from "../metrics/entities/elastic.metric.type";
import { RangeQuery } from "./entities/range.query";

@Injectable()
export class ElasticService {
  private readonly logger: Logger;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    @Inject(forwardRef(() => MetricsService))
    private readonly metricsService: MetricsService
  ) {
    this.logger = new Logger(ElasticService.name);
  }

  async getCount(elasticUrl: string, collection: string, elasticQuery: ElasticQuery | undefined = undefined) {
    const url = `${elasticUrl}/${collection}/_count`;

    const profiler = new PerformanceProfiler();

    const result: any = await this.post(url, elasticQuery?.toJson());

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.count, profiler.duration);

    const count = result.count;

    return count;
  }

  async getItem(elasticUrl: string, collection: string, key: string, identifier: string) {
    const url = `${elasticUrl}/${collection}/_search?q=_id:${identifier}`;

    const profiler = new PerformanceProfiler();

    const result = await this.get(url);

    profiler.stop();
    this.metricsService.setElasticDuration(collection, ElasticMetricType.item, profiler.duration);

    const hits = result.data?.hits?.hits;
    if (hits && hits.length > 0) {
      const document = hits[0];

      return this.formatItem(document, key);
    }

    return undefined;
  }

  private formatItem(document: any, key: string) {
    const { _id, _source } = document;
    const item: any = {};
    item[key] = _id;

    return { ...item, ..._source };
  }

  async getList(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery): Promise<any[]> {
    const url = `${elasticUrl}/${collection}/_search`;

    const profiler = new PerformanceProfiler();

    const result = await this.post(url, elasticQuery.toJson());

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.list, profiler.duration);

    const documents = result.hits.hits;
    return documents.map((document: any) => this.formatItem(document, key));
  }

  public async get(url: string) {
    return await this.apiService.get<any>(url);
  }

  private async post(url: string, body: any) {
    return await this.apiService.post<any, any>(url, body);
  }

  async getDetailedRangeCount(elasticUrl: string, collection: string, key: string, gts: number[]) {
    const result = await Promise.all(
      gts.map(async (gt: number) => this.getCount(
        elasticUrl,
        collection,
        ElasticQuery.create().withFilter([
          new RangeQuery(key, { gt }),
        ])),
      )
    );
    return result;
  }

  public async computeAllItems(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery, computePage: (index: number, transactions: any[]) => Promise<void>) {
    const { scrollId, items: firstItems } = await this.getFirstPageUsingScrollApi(elasticUrl, collection, key, elasticQuery);

    let index = 0;
    let items = firstItems;
    while (items.length > 0) {
      await computePage(index, items);

      index++;
      items = await this.getNextPageUsingScrollApi(elasticUrl, scrollId, key);

      this.logger.log({ items: items.length, totalItems: index });
    }
  }

  private async getFirstPageUsingScrollApi(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery) {
    try {
      const url = `${elasticUrl}/${collection}/_search?scroll=10m`;
      const result = await this.post(url, elasticQuery.toJson());

      const scrollId = result._scroll_id;
      const items = result.hits.hits;

      return {
        scrollId,
        items: items.map((document: any) => this.formatItem(document, key)),
      };
    } catch (error) {
      this.logger.error(error);
      return { items: [] };
    }
  }

  async getNextPageUsingScrollApi(elasticUrl: string, scrollId: string, key: string): Promise<any[]> {
    try {
      const result = await this.post(`${elasticUrl}/_search/scroll`, {
        scroll: '20m',
        scroll_id: scrollId,
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      return result.hits.hits.map((document: any) => this.formatItem(document, key));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}
