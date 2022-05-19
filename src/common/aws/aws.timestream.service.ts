import { Injectable } from '@nestjs/common';
// import * as AWS from "@aws-sdk/client-timestream-query";
// import BigNumber from 'bignumber.js';
// import { PerformanceProfiler } from 'src/utils/performance.profiler';
// import { ApiConfigService } from '../api-config/api.config.service';
import { Pair } from '../maiar-dex/entities/pair';
import { Pool } from '../maiar-dex/entities/pool';
// import { MetricsService } from '../metrics/metrics.service';
// import * as timestreamQueries from './aws.timestream.queries';
// import { AWSTimestreamComponentRequest } from './entities/aws.timestream.component.request';

@Injectable()
export class AWSTimestreamService {
  // private readonly TableName: string;

  // private readonly logger: Logger;
  // private readonly queryClient: AWS.TimestreamQuery;

  // constructor(
  //   private readonly apiConfigService: ApiConfigService,
  //   private readonly metricsService: MetricsService,
  // ) {
  //   this.logger = new Logger(AWSTimestreamService.name);

  //   this.TableName = `"${this.apiConfigService.getAWSTimestreamDatabase()}"."${this.apiConfigService.getAWSTimestreamTable()}"`;

  //   this.queryClient = new AWS.TimestreamQuery({
  //     credentials: {
  //       accessKeyId: this.apiConfigService.getAWSAccessKeyId(),
  //       secretAccessKey: this.apiConfigService.getAWSSecretAccessKey(),
  //     },
  //     region: this.apiConfigService.getAWSRegion(),
  //   });
  // }

  // eslint-disable-next-line require-await
  public async getPoolVolumes(_pairs: Pair[], _from: Date, _to: Date): Promise<Pool[]> {
    return [];

    // const profiler = new PerformanceProfiler();

    // try {
    //   const query = timestreamQueries.getPoolVolumesQuery(this.TableName, pairs, from, to);
    //   const queryResult = await this.queryClient.query({ QueryString: query });
    //   if (queryResult.Rows === undefined) {
    //     return [];
    //   }

    //   const pools = queryResult.Rows
    //     ?.map(row => Pool.fromRow(pairs, row))
    //     .filter((trade): trade is Pool => !!trade);

    //   return pools;
    // } catch (error) {
    //   this.logger.error(`An unhandled error occurred when querying pools`);
    //   this.logger.error(error);
    //   return [];
    // } finally {
    //   profiler.stop();

    //   this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    // }
  }

  // eslint-disable-next-line require-await
  public async getTotalVolume(_pairs: Pair[], _from: Date, _to: Date): Promise<number> {
    return 0;

    // const profiler = new PerformanceProfiler();

    // try {
    //   const query = timestreamQueries.getTotalVolumeQuery(this.TableName, pairs, from, to);
    //   const queryResult = await this.queryClient.query({ QueryString: query });
    //   if (queryResult.Rows === undefined) {
    //     return 0;
    //   }

    //   if (queryResult.Rows.length === 0) {
    //     return 0;
    //   }

    //   const data = queryResult.Rows[0].Data;
    //   if (data === undefined) {
    //     return 0;
    //   }

    //   const volume = new BigNumber(data[0]?.ScalarValue ?? '0').toNumber();
    //   return volume;
    // } catch (error) {
    //   this.logger.error(`An unhandled error occurred when querying volume`);
    //   this.logger.error(error);
    //   return 0;
    // } finally {
    //   profiler.stop();

    //   this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    // }
  }

  // eslint-disable-next-line require-await
  public async getTokenBurntVolume(_tokenIdentifier: string, _from: Date, _to: Date, _tokenDecimals: number = 18): Promise<number> {
    return 0;

    // const profiler = new PerformanceProfiler();

    // try {
    //   const query = timestreamQueries.getTokenBurntVolumeQuery(this.TableName, tokenIdentifier, from, to);
    //   const queryResult = await this.queryClient.query({ QueryString: query });
    //   if (queryResult.Rows === undefined) {
    //     return 0;
    //   }

    //   if (queryResult.Rows.length === 0) {
    //     return 0;
    //   }

    //   const data = queryResult.Rows[0].Data;
    //   if (data === undefined) {
    //     return 0;
    //   }

    //   const volume = new BigNumber(data[0]?.ScalarValue ?? '0').shiftedBy(-tokenDecimals).toNumber();
    //   return volume;
    // } catch (error) {
    //   this.logger.error(`An unhandled error occurred when querying burnt volume`);
    //   this.logger.error(error);

    //   return 0;
    // } finally {
    //   profiler.stop();

    //   this.metricsService.setTimestreamDuration(AWSTimestreamComponentRequest.Pools, profiler.duration);
    // }
  }
}
