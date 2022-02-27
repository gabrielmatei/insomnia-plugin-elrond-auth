import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";

export class ExchangesIngest implements Ingest {
  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
  }

  public async fetch(): Promise<GenericIngestEntity[]> {
    const exchangeWallets = this.apiConfigService.getExchangeWallets();

    const balances = await Promise.all(
      Object
        .entries(exchangeWallets)
        .map(async ([key, value]) => ({
          exchange: key.replace(/\./g, '_').toLowerCase(),
          balance: await this.getExchangeBalance(value),
        }))
    );
    const totalBalance = balances.reduce((sum, { balance }) => sum + balance, 0);

    // TODO 24h data

    const balanceKeys = balances.reduce((record, { exchange, balance }) => {
      record[exchange] = balance;
      return record;
    }, {} as Record<string, number>);

    const data = {
      exchanges: {
        ...balanceKeys,
        total: totalBalance,
      },
    };
    console.log(data);

    return [];
  }

  private async getExchangeBalance(wallets: string[]): Promise<number> {
    const balances = await Promise.all(wallets.map(async (wallet) => {
      const { balance } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/accounts/${wallet}`);

      const formattedBalance = parseInt(balance.length > 18 ? balance.slice(0, -18) : 0);
      return formattedBalance;
    }));

    const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);
    return totalBalance;
  }
}
