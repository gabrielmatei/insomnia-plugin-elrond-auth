import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { MetricsService } from "src/common/metrics/metrics.service";
import { PerformanceProfiler } from "src/utils/performance.profiler";
import { ApiConfigService } from "../api-config/api.config.service";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { ApiService } from "../network/api.service";
import { GatewayComponentRequest } from "./entities/gateway.component.request";

@Injectable()
export class GatewayService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    @Inject(forwardRef(() => MetricsService))
    private readonly metricsService: MetricsService,
    @Inject(forwardRef(() => CachingService))
    private readonly cachingService: CachingService,
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(url: string, component: GatewayComponentRequest): Promise<any> {
    const profiler = new PerformanceProfiler();

    try {
      const result = await this.getRaw(url, component);
      return result?.data;
    } finally {
      profiler.stop();

      this.metricsService.setGatewayDuration(component, profiler.duration);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getRaw(url: string, component: GatewayComponentRequest): Promise<any> {
    const profiler = new PerformanceProfiler();

    try {
      return await this.apiService.get(`${this.apiConfigService.getGatewayUrl()}/${url}`);
    } finally {
      profiler.stop();

      this.metricsService.setGatewayDuration(component, profiler.duration);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createRaw(url: string, component: GatewayComponentRequest, data: any): Promise<any> {
    const profiler = new PerformanceProfiler();

    try {
      return await this.apiService.post(`${this.apiConfigService.getGatewayUrl()}/${url}`, data);
    } finally {
      profiler.stop();

      this.metricsService.setGatewayDuration(component, profiler.duration);
    }
  }

  async getEpoch(): Promise<number> {
    const {
      status: { erd_epoch_number },
    } = await this.get('network/status/4294967295', GatewayComponentRequest.networkStatus);
    return erd_epoch_number;
  }

  async getNetworkConfig(): Promise<{ roundsPerEpoch: number, roundDuration: number, numShards: number }> {
    const {
      config: { erd_round_duration, erd_rounds_per_epoch, erd_num_shards_without_meta },
    } = await this.get('network/config', GatewayComponentRequest.networkConfig);

    const roundsPerEpoch = erd_rounds_per_epoch;
    const roundDuration = erd_round_duration / 1000;
    const numShards = erd_num_shards_without_meta;

    return { roundsPerEpoch, roundDuration, numShards };
  }

  async vmQuery(contract: string, func: string, caller: string | undefined = undefined, args: string[] = []): Promise<string[]> {
    const payload = {
      scAddress: contract,
      FuncName: func,
      caller: caller,
      args: args,
    };

    const result = await this.createRaw(
      'vm-values/query',
      GatewayComponentRequest.vmQuery,
      payload,
    );

    const data = result.data.data;
    return 'ReturnData' in data ? data.ReturnData : data.returnData;
  }

  public async getShards(): Promise<number[]> {
    return await this.cachingService.getOrSetCache(
      CacheInfo.Shards.key,
      async () => await this.getShardsRaw(),
      CacheInfo.Shards.ttl
    );
  }

  private async getShardsRaw(): Promise<number[]> {
    const { numShards } = await this.getNetworkConfig();
    return [...Array(numShards).keys(), 4294967295];
  }
}
