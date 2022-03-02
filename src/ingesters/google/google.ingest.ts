import moment from "moment";
import { google, webmasters_v3 } from "googleapis";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { GoogleEntity } from "./google.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleIngest implements Ingest {
  public readonly name = GoogleIngest.name;
  public readonly entityTarget = GoogleEntity;

  private readonly webmasters: webmasters_v3.Webmasters = google.webmasters('v3');

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'config/googleAuthConfig.json',
      scopes: [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/webmasters.readonly',
      ],
    });
    google.options({ auth });
  }

  public async fetch(): Promise<GoogleEntity[]> {
    const startDate = moment().startOf('day').subtract(3, 'days').format('YYYY-MM-DD');
    const endDate = moment().startOf('day').subtract(2, 'days').format('YYYY-MM-DD');
    const highlightedWords = ['elrond', 'egld', 'egold'];

    const queryData: any = {};

    const { data } = await this.webmasters.searchanalytics.query({
      siteUrl: 'https://elrond.com',
      requestBody: {
        startDate,
        endDate,
      },
    });

    if (data.rows) {
      const [searchData] = data.rows;
      queryData.total = searchData;
    }

    await Promise.all(
      highlightedWords.map(async (word) => {
        const { data } = await this.webmasters.searchanalytics.query({
          siteUrl: 'https://elrond.com',
          requestBody: {
            startDate,
            endDate,
            dimensionFilterGroups: [
              {
                filters: [
                  {
                    dimension: 'query',
                    operator: 'contains',
                    expression: word,
                  },
                ],
              },
            ],
          },
        });

        if (data.rows) {
          const [searchData] = data.rows;
          queryData[word] = searchData;
        }
      })
    );

    const timestamp = moment().utc().toDate();
    return GoogleEntity.fromObject(timestamp, queryData);
  }
}
