import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";

export class TwitterIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<GenericIngestEntity[]> {
    console.log(this.apiConfigService, this.apiService);

    const dayOfMonth = moment().date();
    // Twitter allows the parsing of a maximum of 500000 tweets per month per account
    // Since we already have 2 accounts, we can parse up to 1000000 tweets per month
    // => 31000 per day => max 300 calls per day ( 30000 tweets ) ( allow for some testing/manoeuvring ) ( assuming the cron runs once a day )
    const headers = {
      authorization: `Bearer ${dayOfMonth > 15
        ? 'AAAAAAAAAAAAAAAAAAAAABkeLQEAAAAAdS3VuYUJ5TRy4H%2FsbYJXKpNHdG8%3DTj1JaN6YFVQL4g0NInkb2xYlXTLgtpkpZHj0unaFtUXKOlpffk'
        : 'AAAAAAAAAAAAAAAAAAAAANwsLQEAAAAAIDpPn7QRT%2FozX7%2BWTR6%2B%2F8hreOA%3DK37Oxwyg3AMVgcPpQvZ3nM5yF8RCeOjnzk45bYkVVI28YLMptU'
        }`,
    };
    const searchedWords = ['elrond', 'egld', 'elrondnetwork'];
    const gte = moment().startOf('day').subtract(1, 'day').format();
    const lt = moment().startOf('day').format();
    let mentionsTotal = 0;
    let previousToken = null;
    let callsMade = 1;

    const getTwitterMentions = async (token: any) => {
      previousToken = token;

      const params = {
        query: searchedWords.join(' OR '),
        start_time: gte,
        end_time: lt,
        max_results: 100,
        next_token: previousToken,
      };

      const { meta } = await this.apiService.get<any>(`https://api.twitter.com/2/tweets/search/recent`, {
        params,
        headers,
      });

      let mentions = 0;
      // if (meta.next_token && meta.next_token !== previousToken && callsMade < 290) {
      if (meta.next_token && meta.next_token !== previousToken && callsMade < 1) {
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

    const {
      data: {
        public_metrics: { followers_count },
      },
    } = await this.apiService.get(`https://api.twitter.com/2/users/by/username/ElrondNetwork`, {
      params: { 'user.fields': 'public_metrics' },
      headers,
    });

    // const followers_count_24h = 0;
    // const previousResult24h = await previousValue24h('twitter', 'twitter', 'followers');
    // if (previousResult24h.Rows.length) {
    //   const {
    //     Rows: [
    //       {
    //         Data: [{ ScalarValue: last_24h }],
    //       },
    //     ],
    //   } = previousResult24h;
    //   followers_count_24h = last_24h && last_24h > 0 ? followers_count - last_24h : 0;
    // }

    const data = {
      twitter: {
        mentions: mentionsTotal,
        followers: followers_count,
        // followers_24h: followers_count_24h,
      },
    };
    console.log(data);
    return [];

  }
}
