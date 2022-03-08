import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { TwitterEntity } from "src/common/timescale/entities/twitter.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";

@Injectable()
export class TwitterIngest implements Ingest {
  public static readonly USERNAME = 'ElrondNetwork';
  public static readonly KEYWORDS = ['elrond', 'egld', 'elrondnetwork'];
  // public static readonly MAX_CALLS = 290; // TODO
  public static readonly MAX_CALLS = 1;

  public readonly name = TwitterIngest.name;
  public readonly entityTarget = TwitterEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
  ) { }

  public async fetch(): Promise<TwitterEntity[]> {
    const startTime = moment.utc().startOf('day').subtract(1, 'day');
    const endTime = moment.utc().startOf('day');

    const mentions = await this.getTwitterMentions(TwitterIngest.KEYWORDS, startTime, endTime);
    const followers = await this.getTwitterFollowers(TwitterIngest.USERNAME);

    return TwitterEntity.fromObject(startTime.toDate(), {
      twitter: {
        mentions,
        followers,
      },
    });
  }

  private getTwitterAuthorizationHeaders() {
    const authorizationBearers = this.apiConfigService.getTwitterAuthorizationBearers();

    // Twitter allows the parsing of a maximum of 500000 tweets per month per account
    // Since we already have 2 accounts, we can parse up to 1000000 tweets per month
    // => 31000 per day => max 300 calls per day ( 30000 tweets ) ( allow for some testing/manoeuvring ) ( assuming the cron runs once a day )
    const dayOfMonth = moment().date();
    const headers = {
      authorization: `Bearer ${authorizationBearers[dayOfMonth > 15 ? 1 : 0]}`,
    };
    return headers;
  }

  private async getTwitterFollowers(username: string): Promise<number> {
    const {
      data: {
        public_metrics: { followers_count },
      },
    } = await this.apiService.get(`${this.apiConfigService.getTwitterUrl()}/users/by/username/${username}`, {
      params: { 'user.fields': 'public_metrics' },
      headers: this.getTwitterAuthorizationHeaders(),
    });

    return followers_count;
  }

  private async getTwitterMentions(keywords: string[], startTime: moment.Moment, endTime: moment.Moment, maxCalls: number = TwitterIngest.MAX_CALLS) {
    let mentionsTotal = 0;
    let previousToken = null;
    let callsMade = 1;

    const getTwitterMentions = async (token: any) => {
      previousToken = token;

      const params = {
        query: keywords.join(' OR '),
        start_time: startTime.format(),
        end_time: endTime.format(),
        max_results: 100,
        next_token: previousToken,
      };
      const { meta } = await this.apiService.get<any>(
        `${this.apiConfigService.getTwitterUrl()}/tweets/search/recent`,
        {
          params,
          headers: this.getTwitterAuthorizationHeaders(),
        });

      let mentions = 0;
      if (meta.next_token && meta.next_token !== previousToken && callsMade < maxCalls) {
        callsMade += 1;
        mentions = await getTwitterMentions(meta.next_token);
      } else {
        mentions = meta.result_count;
      }

      mentionsTotal += mentions;
      callsMade += 1;

      return meta.result_count;
    };
    await getTwitterMentions(null);

    return mentionsTotal;
  }
}
