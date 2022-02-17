import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ApiService } from "../network/api.service";
import { PerformanceProfiler } from "src/utils/performance.profiler";
import { MetricsService } from "src/common/metrics/metrics.service";
import { ApiConfigService } from "../api-config/api.config.service";
import { ElasticQuery } from "./entities/elastic.query";
import { QueryType } from "./entities/query.type";
import { QueryOperator } from "./entities/query.operator";
import { QueryConditionOptions } from "./entities/query.condition.options";
import { ElasticSortOrder } from "./entities/elastic.sort.order";
import { ElasticMetricType } from "../metrics/entities/elastic.metric.type";
import { QueryPagination } from "../entities/query.paginations";

@Injectable()
export class ElasticService {
  private readonly url: string;

  constructor(
    private apiConfigService: ApiConfigService,
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    @Inject(forwardRef(() => MetricsService))
    private readonly metricsService: MetricsService
  ) {
    this.url = apiConfigService.getElasticUrl();
  }

  async getCount(collection: string, elasticQuery: ElasticQuery | undefined = undefined) {
    const url = `${this.apiConfigService.getElasticUrl()}/${collection}/_count`;

    const profiler = new PerformanceProfiler();

    const result: any = await this.post(url, elasticQuery?.toJson());

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.count, profiler.duration);

    const count = result.count;

    return count;
  }

  async getItem(collection: string, key: string, identifier: string) {
    const url = `${this.url}/${collection}/_search?q=_id:${identifier}`;

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

  async getList(collection: string, key: string, elasticQuery: ElasticQuery, overrideUrl?: string): Promise<any[]> {
    const url = `${overrideUrl ?? this.url}/${collection}/_search`;

    const profiler = new PerformanceProfiler();

    const result = await this.post(url, elasticQuery.toJson());

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.list, profiler.duration);

    const documents = result.data.hits.hits;
    return documents.map((document: any) => this.formatItem(document, key));
  }

  async getAccountEsdtByIdentifier(identifier: string, pagination?: QueryPagination) {
    return this.getAccountEsdtByIdentifiers([identifier], pagination);
  }

  async getAccountEsdtByIdentifiers(identifiers: string[], pagination?: QueryPagination) {
    if (identifiers.length === 0) {
      return [];
    }

    const queries = identifiers.map((identifier) => QueryType.Match('identifier', identifier, QueryOperator.AND));

    let elasticQuery = ElasticQuery.create();

    if (pagination) {
      elasticQuery = elasticQuery.withPagination({ from: pagination.from, size: pagination.size });
    } else {
      elasticQuery = elasticQuery.withPagination({ from: 0, size: 100 });
    }

    elasticQuery = elasticQuery
      .withSort([{ name: "balanceNum", order: ElasticSortOrder.descending }])
      .withCondition(QueryConditionOptions.mustNot, [QueryType.Match('address', 'pending')])
      .withCondition(QueryConditionOptions.should, queries);

    const documents = await this.getDocuments('accountsesdt', elasticQuery.toJson());

    const result = documents.map((document: any) => this.formatItem(document, 'identifier'));

    return result;
  }

  async getAccountEsdtByAddress(address: string, from: number, size: number, token: string | undefined) {
    const queries = [
      QueryType.Match('address', address),
      QueryType.Exists('identifier'),
    ];

    if (token) {
      queries.push(
        QueryType.Match('token', token, QueryOperator.AND)
      );
    }

    const elasticQuery = ElasticQuery.create()
      .withPagination({ from, size })
      .withCondition(QueryConditionOptions.must, queries);

    const documents = await this.getDocuments('accountsesdt', elasticQuery.toJson());

    return documents.map((document: any) => this.formatItem(document, 'identifier'));
  }

  async getAccountEsdtByAddressAndIdentifier(address: string, identifier: string) {
    const queries = [
      QueryType.Match('address', address),
      QueryType.Match('token', identifier, QueryOperator.AND),
    ];

    const elasticQuery = ElasticQuery.create()
      .withPagination({ from: 0, size: 1 })
      .withCondition(QueryConditionOptions.must, queries);

    const documents = await this.getDocuments('accountsesdt', elasticQuery.toJson());

    return documents.map((document: any) => this.formatItem(document, 'identifier'))[0];
  }

  async getAccountEsdtByAddressCount(address: string) {
    const queries = [
      QueryType.Match('address', address),
      QueryType.Exists('identifier'),
    ];

    const elasticQuery = ElasticQuery.create()
      .withCondition(QueryConditionOptions.must, queries);

    return await this.getDocumentCount('accountsesdt', elasticQuery.toJson());
  }

  public async get(url: string) {
    return await this.apiService.get<any>(url);
  }

  private async post(url: string, body: any) {
    return await this.apiService.post<any, any>(url, body);
  }

  private async getDocuments(collection: string, body: any) {
    const profiler = new PerformanceProfiler();

    const result = await this.post(`${this.url}/${collection}/_search`, body);

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.list, profiler.duration);

    return result.data.hits.hits;
  }

  private async getDocumentCount(collection: string, body: any) {
    const profiler = new PerformanceProfiler();

    const {
      data: {
        hits: {
          total: {
            value,
          },
        },
      },
    } = await this.post(`${this.url}/${collection}/_search`, body);

    profiler.stop();

    this.metricsService.setElasticDuration(collection, ElasticMetricType.count, profiler.duration);

    return value;
  }
}
