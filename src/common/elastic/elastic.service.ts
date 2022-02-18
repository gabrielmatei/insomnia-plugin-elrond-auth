import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ApiService } from "../network/api.service";
import { PerformanceProfiler } from "src/utils/performance.profiler";
import { MetricsService } from "src/common/metrics/metrics.service";
import { ElasticQuery } from "./entities/elastic.query";
import { ElasticMetricType } from "../metrics/entities/elastic.metric.type";

@Injectable()
export class ElasticService {
  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    @Inject(forwardRef(() => MetricsService))
    private readonly metricsService: MetricsService
  ) { }

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

  async getList(elasticUrl: string, collection: string, key: string, elasticQuery: ElasticQuery, overrideUrl?: string): Promise<any[]> {
    const url = `${overrideUrl ?? elasticUrl}/${collection}/_search`;

    const profiler = new PerformanceProfiler();

    const result = await this.post(url, elasticQuery.toJson());

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.list, profiler.duration);

    const documents = result.data.hits.hits;
    return documents.map((document: any) => this.formatItem(document, key));
  }

  public async get(url: string) {
    return await this.apiService.get<any>(url);
  }

  private async post(url: string, body: any) {
    return await this.apiService.post<any, any>(url, body);
  }
}
