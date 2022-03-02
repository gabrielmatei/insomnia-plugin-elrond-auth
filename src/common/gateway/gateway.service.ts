import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { MetricsService } from "src/common/metrics/metrics.service";
import { PerformanceProfiler } from "src/utils/performance.profiler";
import { ApiConfigService } from "../api-config/api.config.service";
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
  ) { }

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

  async getRaw(url: string, component: GatewayComponentRequest): Promise<any> {
    const profiler = new PerformanceProfiler();

    try {
      return await this.apiService.get(`${this.apiConfigService.getGatewayUrl()}/${url}`);
    } finally {
      profiler.stop();

      this.metricsService.setGatewayDuration(component, profiler.duration);
    }
  }

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

  async getNetworkConfig(): Promise<{ roundsPerEpoch: number, roundDuration: number }> {
    const {
      config: { erd_round_duration, erd_rounds_per_epoch },
    } = await this.get('network/config', GatewayComponentRequest.networkConfig);

    const roundsPerEpoch = erd_rounds_per_epoch;
    const roundDuration = erd_round_duration / 1000;

    return { roundsPerEpoch, roundDuration };
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
}
