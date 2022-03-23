import { Injectable } from "@nestjs/common";
import moment from "moment";
import { TrendsEntity } from "src/common/timescale/entities/trends.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleTrendsApi = require('google-trends-api');

@Injectable()
export class TrendsIngest implements Ingest {
  public static readonly KEYWORDS = ['elrond', 'egld'];

  public readonly name = TrendsIngest.name;
  public readonly entityTarget = TrendsEntity;

  public async fetch(): Promise<IngestRecords[]> {
    const startTime = moment.utc().startOf('day').subtract(1, 'day').toDate();
    const endTime = moment.utc().startOf('day').toDate();

    const googleTrendsRaw = await googleTrendsApi.interestOverTime({
      keyword: TrendsIngest.KEYWORDS,
      startTime,
      endTime,
      granularTimeResolution: true,
    });

    const googleTrends = JSON.parse(googleTrendsRaw);
    const averages = googleTrends?.default?.averages || googleTrends?.averages;

    const data = {
      trends: {
        google: averages[0],
      },
    };
    return [{
      entity: TrendsEntity,
      records: TrendsEntity.fromObject(startTime, data),
    }];
  }
}
