import moment from "moment";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";
const googleTrends = require('google-trends-api');

export class GoogleTrendsIngest implements Ingest {
  public async fetch(): Promise<GenericIngestEntity[]> {
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

    const data = {
      google: averages[0],
    };
    console.log(data);
    return [];
  }
}
