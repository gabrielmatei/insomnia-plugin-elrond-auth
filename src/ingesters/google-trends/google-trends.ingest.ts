import { Injectable } from "@nestjs/common";
import moment from "moment";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { GoogleTrendsEntity } from "./google-trends.entity";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleTrends = require('google-trends-api');

@Injectable()
export class GoogleTrendsIngest implements Ingest {
  public readonly name = GoogleTrendsIngest.name;
  public readonly entityTarget = GoogleTrendsEntity;

  public async fetch(): Promise<GoogleTrendsEntity[]> {
    const startTime = moment().startOf('day').subtract(1, 'day').toDate();
    const endTime = moment().startOf('day').toDate();

    const trendsRaw = await googleTrends.interestOverTime({
      keyword: ['elrond', 'egld'],
      startTime,
      endTime,
      granularTimeResolution: true,
    });

    const trends = JSON.parse(trendsRaw);
    const averages = trends?.default?.averages || trends?.averages;

    const timestamp = moment().utc().toDate();
    return GoogleTrendsEntity.fromRecord(timestamp, {
      google: averages[0],
    });
  }
}
