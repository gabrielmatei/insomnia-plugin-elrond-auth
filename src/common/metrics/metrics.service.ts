import { Injectable } from "@nestjs/common";
import { register, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import { ElasticMetricType } from "./entities/elastic.metric.type";

@Injectable()
export class MetricsService {
  private static fetcherAlertsHistogram: Histogram<string>;
  private static apiCallsHistogram: Histogram<string>;
  private static externalCallsHistogram: Histogram<string>;
  private static pendingRequestsHistogram: Gauge<string>;
  private static apiResponseSizeHistogram: Histogram<string>;
  private static lastProcessedNonceGauge: Gauge<string>;
  private static pendingApiHitGauge: Gauge<string>;
  private static cachedApiHitGauge: Gauge<string>;
  private static elasticDurationHistogram: Histogram<string>;
  private static gatewayDurationHistogram: Histogram<string>;
  private static jobsHistogram: Histogram<string>;
  private static timestreamDurationHistogram: Histogram<string>;
  private static isDefaultMetricsRegistered: boolean = false;

  constructor() {
    if (!MetricsService.fetcherAlertsHistogram) {
      MetricsService.fetcherAlertsHistogram = new Histogram({
        name: 'fetcher_alerts',
        help: 'Fetcher Alerts',
        labelNames: ['code'],
        buckets: [],
      });
    }

    if (!MetricsService.apiCallsHistogram) {
      MetricsService.apiCallsHistogram = new Histogram({
        name: 'api',
        help: 'API Calls',
        labelNames: ['endpoint', 'code'],
        buckets: [],
      });
    }

    if (!MetricsService.externalCallsHistogram) {
      MetricsService.externalCallsHistogram = new Histogram({
        name: 'external_apis',
        help: 'External Calls',
        labelNames: ['system'],
        buckets: [],
      });
    }

    if (!MetricsService.pendingRequestsHistogram) {
      MetricsService.pendingRequestsHistogram = new Gauge({
        name: 'pending_requests',
        help: 'Pending requests',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.apiResponseSizeHistogram) {
      MetricsService.apiResponseSizeHistogram = new Histogram({
        name: 'api_response_size',
        help: 'API Response size',
        labelNames: ['endpoint'],
        buckets: [],
      });
    }

    if (!MetricsService.pendingApiHitGauge) {
      MetricsService.pendingApiHitGauge = new Gauge({
        name: 'pending_api_hits',
        help: 'Number of hits for pending API calls',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.cachedApiHitGauge) {
      MetricsService.cachedApiHitGauge = new Gauge({
        name: 'cached_api_hits',
        help: 'Number of hits for cached API calls',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.elasticDurationHistogram) {
      MetricsService.elasticDurationHistogram = new Histogram({
        name: 'elastic_duration',
        help: 'Elastic Duration',
        labelNames: ['type', 'index'],
        buckets: [],
      });
    }

    if (!MetricsService.gatewayDurationHistogram) {
      MetricsService.gatewayDurationHistogram = new Histogram({
        name: 'gateway_duration',
        help: 'Gateway Duration',
        labelNames: ['endpoint'],
        buckets: [],
      });
    }

    if (!MetricsService.jobsHistogram) {
      MetricsService.jobsHistogram = new Histogram({
        name: 'jobs',
        help: 'Jobs',
        labelNames: ['job_identifier', 'result'],
        buckets: [],
      });
    }

    if (!MetricsService.timestreamDurationHistogram) {
      MetricsService.timestreamDurationHistogram = new Histogram({
        name: 'timestream_duration',
        help: 'Timestream Duration',
        labelNames: ['endpoint'],
        buckets: [],
      });
    }

    if (!MetricsService.isDefaultMetricsRegistered) {
      MetricsService.isDefaultMetricsRegistered = true;
      collectDefaultMetrics();
    }
  }

  setFetcherAlert(fetcherName: string) {
    MetricsService.fetcherAlertsHistogram.labels(fetcherName).observe(1);
  }

  setApiCall(endpoint: string, status: number, duration: number, responseSize: number) {
    MetricsService.apiCallsHistogram.labels(endpoint, status.toString()).observe(duration);
    MetricsService.apiResponseSizeHistogram.labels(endpoint).observe(responseSize);
  }

  setPendingRequestsCount(count: number) {
    MetricsService.pendingRequestsHistogram.set(count);
  }

  setExternalCall(system: string, duration: number) {
    MetricsService.externalCallsHistogram.labels(system).observe(duration);
  }

  setLastProcessedNonce(shardId: number, nonce: number) {
    MetricsService.lastProcessedNonceGauge.set({ shardId }, nonce);
  }

  setElasticDuration(collection: string, type: ElasticMetricType, duration: number) {
    MetricsService.elasticDurationHistogram.labels(type, collection).observe(duration);
  }

  setGatewayDuration(name: string, duration: number) {
    MetricsService.gatewayDurationHistogram.labels(name).observe(duration);
  }

  incrementPendingApiHit(endpoint: string) {
    MetricsService.pendingApiHitGauge.inc({ endpoint });
  }

  incrementCachedApiHit(endpoint: string) {
    MetricsService.cachedApiHitGauge.inc({ endpoint });
  }

  setTimestreamDuration(name: string, duration: number) {
    MetricsService.timestreamDurationHistogram.labels(name).observe(duration);
  }

  static setJobResult(job: string, result: 'success' | 'error', duration: number) {
    MetricsService.jobsHistogram.labels(job, result).observe(duration);
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
