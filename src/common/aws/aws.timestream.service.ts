import { Injectable, Logger } from '@nestjs/common';
import { HttpsAgent } from 'agentkeepalive';
import AWS, { Credentials, TimestreamQuery } from 'aws-sdk';
import BigNumber from 'bignumber.js';
import { PerformanceProfiler } from 'src/utils/performance.profiler';
import { ApiConfigService } from '../api-config/api.config.service';
import { Pair } from '../maiar-dex/entities/pair';
import { Pool } from '../maiar-dex/entities/pool';
import { MetricsService } from '../metrics/metrics.service';
import * as timestreamQueries from './aws.timestream.queries';
import { AWSTimestreamComponentRequest } from './entities/aws.timestream.component.request';

@Injectable()
export class AWSTimestreamService {
  private readonly TableName: string;

  private readonly logger: Logger;
  private readonly queryClient: TimestreamQuery;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly metricsService: MetricsService,
  ) {
    this.logger = new Logger(AWSTimestreamService.name);

    this.TableName = `"${this.apiConfigService.getAWSTimestreamDatabase()}"."${this.apiConfigService.getAWSTimestreamTable()}"`;

    AWS.config.credentials = new Credentials(
      this.apiConfigService.getAWSAccessKeyId(),
      this.apiConfigService.getAWSSecretAccessKey()
    );
    AWS.config.update({ region: this.apiConfigService.getAWSRegion() });

    const httpsAgent = new HttpsAgent({
      maxSockets: 5000,
    });
    this.queryClient = new TimestreamQuery({
      maxRetries: 10,
      httpOptions: {
        timeout: 20000,
        agent: httpsAgent,
      },
    });
  }

  public async getPoolVolumes(pairs: Pair[], from: Date, to: Date): Promise<Pool[]> {
    const profiler = new PerformanceProfiler();

    try {
      const query = timestreamQueries.getPoolVolumesQuery(this.TableName, pairs, from, to);
      const queryResult = await this.queryClient.query({ QueryString: query }).promise();

      const pools = queryResult.Rows
        ?.map(row => Pool.fromRow(pairs, row))
        .filter((trade): trade is Pool => !!trade);

      return pools;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when querying pools`);
      this.logger.error(error);
      return [];
    } finally {
      profiler.stop();

      this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    }
  }

  public async getTotalVolume(pairs: Pair[], from: Date, to: Date): Promise<number> {
    const profiler = new PerformanceProfiler();

    try {
      const query = timestreamQueries.getTotalVolumeQuery(this.TableName, pairs, from, to);
      const queryResult = await this.queryClient.query({ QueryString: query }).promise();

      if (queryResult.Rows.length === 0) {
        return 0;
      }

      const volume = new BigNumber(queryResult.Rows[0]?.Data[0]?.ScalarValue ?? '0').toNumber();
      return volume;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when querying volume`);
      this.logger.error(error);
      return 0;
    } finally {
      profiler.stop();

      this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    }
  }

  public async getTokenBurntVolume(token: string, from: Date, to: Date): Promise<number> {
    const profiler = new PerformanceProfiler();

    try {
      const query = timestreamQueries.getTokenBurntVolumeQuery(this.TableName, token, from, to);
      const queryResult = await this.queryClient.query({ QueryString: query }).promise();

      if (queryResult.Rows.length === 0) {
        return 0;
      }

      const volume = new BigNumber(queryResult.Rows[0]?.Data[0]?.ScalarValue ?? '0').toNumber();
      return volume;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when querying burnt volume`);
      this.logger.error(error);
      return 0;
    } finally {
      profiler.stop();

      this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    }
  }
}
