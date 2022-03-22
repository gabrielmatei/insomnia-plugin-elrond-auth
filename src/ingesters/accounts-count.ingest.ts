import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class AccountsCountIngest implements Ingest {
  public readonly name = AccountsCountIngest.name;
  public readonly entityTarget = AccountsHistoricalEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly gatewayService: GatewayService,
    private readonly elasticService: ElasticService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment.utc().startOf('day').subtract(1, 'days').toDate();

    const [
      accountsCount,
      contractsCount,
      { usersCount: maiarCount },
    ] = await Promise.all([
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), `accounts-000001_${epoch}`),
      this.elasticService.getCount(this.apiConfigService.getElasticUrl(), 'scdeploys'),
      this.apiService.get<{ usersCount: number }>(`${this.apiConfigService.getMaiarApiUrl()}/api/v1/stats/users`),
    ]);

    const [
      previousAccountsResult24h,
      previousContractsResult24h,
      previousMaiarResult24h,
    ] = await Promise.all([
      this.timescaleService.getPreviousValue24h(AccountsHistoricalEntity, timestamp, 'count', 'accounts'),
      this.timescaleService.getPreviousValue24h(AccountsHistoricalEntity, timestamp, 'count', 'contracts'),
      this.timescaleService.getPreviousValue24h(AccountsHistoricalEntity, timestamp, 'count', 'maiar'),
    ]);

    const accountsCount24h = previousAccountsResult24h && previousAccountsResult24h > 0 ? accountsCount - previousAccountsResult24h : 0;
    const contractsCount24h = previousContractsResult24h && previousContractsResult24h > 0 ? contractsCount - previousContractsResult24h : 0;
    const maiarCount24h = previousMaiarResult24h && previousMaiarResult24h > 0 ? maiarCount - previousMaiarResult24h : 0;

    const data = {
      accounts: {
        count: accountsCount,
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
    };
    return {
      historical: {
        entity: AccountsHistoricalEntity,
        records: AccountsHistoricalEntity.fromObject(timestamp, data),
      },
    };
  }
}
