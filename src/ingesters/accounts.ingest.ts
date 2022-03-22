import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ApiService } from "src/common/network/api.service";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { AccountsEntity } from "src/common/timescale/entities/accounts.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class AccountsIngest implements Ingest {
  public readonly name = AccountsIngest.name;
  public readonly entityTarget = AccountsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const [
      accountsCount,
      contractsCount,
      { usersCount: maiarCount },
    ] = await Promise.all([
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'accounts'),
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'scdeploys'),
      this.apiService.get<{ usersCount: number }>(`${this.apiConfigService.getMaiarApiUrl()}/api/v1/stats/users`),
    ]);

    const [
      count_gt_0,
      count_gt_0_1,
      count_gt_1,
      count_gt_10,
      count_gt_100,
      count_gt_1000,
      count_gt_10000,
    ] = await this.elasticService.getDetailedRangeCount(
      this.apiConfigService.getElasticUrl(),
      'accounts',
      'balanceNum',
      [0, 0.1, 1, 10, 100, 1000, 10000]
    );

    const [
      previousAccountsResult24h,
      previousContractsResult24h,
      previousMaiarResult24h,
    ] = await Promise.all([
      this.timescaleService.getPreviousValue24h(AccountsEntity, timestamp, 'count', 'accounts'),
      this.timescaleService.getPreviousValue24h(AccountsEntity, timestamp, 'count', 'contracts'),
      this.timescaleService.getPreviousValue24h(AccountsEntity, timestamp, 'count', 'maiar'),
    ]);

    const accountsCount24h = previousAccountsResult24h && previousAccountsResult24h > 0 ? accountsCount - previousAccountsResult24h : 0;
    const contractsCount24h = previousContractsResult24h && previousContractsResult24h > 0 ? contractsCount - previousContractsResult24h : 0;
    const maiarCount24h = previousMaiarResult24h && previousMaiarResult24h > 0 ? maiarCount - previousMaiarResult24h : 0;

    return {
      current: {
        entity: AccountsEntity,
        records: AccountsEntity.fromObject(timestamp, {
          accounts: {
            count: accountsCount,
            count_gt_0,
            count_gt_0_1,
            count_gt_1,
            count_gt_10,
            count_gt_100,
            count_gt_1000,
            count_gt_10000,
            count_24h: accountsCount24h,
          },
          maiar: {
            count: maiarCount,
            count_24h: maiarCount24h,
          },
          contracts: {
            count: contractsCount,
            count_24h: contractsCount24h,
          },
        }),
      },
      historical: {
        entity: AccountsHistoricalEntity,
        records: AccountsHistoricalEntity.fromObject(timestamp, {
          accounts: {
            count: accountsCount,
            count_24h: accountsCount24h,
          },
          maiar: {
            count: maiarCount,
            count_24h: maiarCount24h,
          },
          balance: {
            count_gt_0,
            count_gt_0_1,
            count_gt_1,
            count_gt_10,
            count_gt_100,
            count_gt_1000,
            count_24h: accountsCount24h,
          },
          contracts: {
            count: contractsCount,
            count_24h: contractsCount24h,
          },
        }),
      },
    };
  }
}
