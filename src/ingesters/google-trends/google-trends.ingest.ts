import moment from "moment";
import { Ingest } from "src/crons/data-ingester/ingester";
import { GoogleTrends } from "./google-trends.entity";
const googleTrends = require('google-trends-api');

export class GoogleTrendsIngest implements Ingest {
  public readonly name = GoogleTrendsIngest.name;
  public readonly entityTarget = GoogleTrends;

  public async fetch(): Promise<GoogleTrends[]> {
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
    return GoogleTrends.fromRecord(timestamp, {
      google: averages[0],
    });
  }
}
