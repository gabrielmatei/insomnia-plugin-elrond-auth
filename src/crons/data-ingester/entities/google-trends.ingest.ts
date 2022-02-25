import moment from "moment";
import { Ingest } from "./ingest";
const googleTrends = require('google-trends-api');

export class GoogleTrendsIngest implements Ingest {
  public async fetch(): Promise<Record<string, number>> {
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

    return {
      google: averages[0],
    };
  }
}
