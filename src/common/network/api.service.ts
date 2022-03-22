import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import { Agent } from "http";
import { MetricsService } from "src/common/metrics/metrics.service";
import { PerformanceProfiler } from "../../utils/performance.profiler";
import { ApiConfigService } from "../api-config/api.config.service";
import { ApiSettings } from "./entities/api.settings";

@Injectable()
export class ApiService {
  private readonly logger: Logger;
  private readonly defaultTimeout: number = 30000;
  private keepaliveAgent: Agent | undefined | null = null;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    @Inject(forwardRef(() => MetricsService))
    private readonly metricsService: MetricsService,
  ) {
    this.logger = new Logger(ApiService.name);
  }

  private getKeepAliveAgent(): Agent | undefined {
    if (this.keepaliveAgent === null) {
      if (this.apiConfigService.getUseKeepAliveAgentFlag()) {
        this.keepaliveAgent = new Agent({
          keepAlive: true,
          maxSockets: Infinity,
          maxFreeSockets: 10,
          timeout: this.apiConfigService.getAxiosTimeout(), // active socket keepalive
          // freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
        });
      } else {
        this.keepaliveAgent = undefined;
      }
    }

    return this.keepaliveAgent;
  }

  private getConfig(settings: ApiSettings): AxiosRequestConfig {
    const timeout = settings.timeout || this.defaultTimeout;
    const maxRedirects = settings.skipRedirects === true ? 0 : undefined;

    const headers = settings.headers;

    const rateLimiterSecret = this.apiConfigService.getRateLimiterSecret();
    if (rateLimiterSecret) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      headers['x-rate-limiter-secret'] = rateLimiterSecret;
    }

    return {
      timeout,
      maxRedirects,
      httpAgent: this.getKeepAliveAgent(),
      responseType: settings.responseType,
      headers,
      params: settings.params,
      transformResponse: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          try {
            return JSON.parse(data);
          } catch (error) {
            return data;
          }
        },
      ],
    };
  }

  async get<T>(url: string, settings: ApiSettings = new ApiSettings()): Promise<T> {
    const profiler = new PerformanceProfiler();

    try {
      const result = await axios.get<T>(url, this.getConfig(settings));
      return result.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error({
        method: 'GET',
        path: url,
        response: error.response?.data,
        status: error.response?.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  async post<TInput, TOutput>(url: string, data: TInput, settings: ApiSettings = new ApiSettings()): Promise<TOutput> {
    const profiler = new PerformanceProfiler();

    try {
      const result = await axios.post(url, data, this.getConfig(settings));
      return result.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error({
        method: 'POST',
        url,
        response: error.response?.data,
        status: error.response?.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  async head(url: string, settings: ApiSettings = new ApiSettings()): Promise<{ headers: { [key: string]: string }, status: number }> {
    const profiler = new PerformanceProfiler();

    try {
      return await axios.head(url, this.getConfig(settings));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error({
        method: 'HEAD',
        url,
        response: error.response?.data,
        status: error.response?.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  private getHostname(url: string): string {
    return new URL(url).hostname;
  }
}
