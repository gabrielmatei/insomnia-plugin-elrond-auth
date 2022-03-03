import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { ExchangesEntity } from "./exchanges.entity";

@Injectable()
export class ExchangesIngest implements Ingest {
  public readonly name = ExchangesIngest.name;
  public readonly entityTarget = ExchangesEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly timescaleService: TimescaleService,
  ) { }

  public async fetch(): Promise<ExchangesEntity[]> {
    const timestamp = moment().utc().toDate();
    const exchangeWallets = this.apiConfigService.getExchangeWallets();

    const exchangeDetails: any = {};

    let totalBalance = 0;
    let totalInflow24h = 0;
    let totalOutflow24h = 0;

    await Promise.all(Object.entries(exchangeWallets).map(async ([exchange, wallets]) => {
      const balance = await this.getExchangeBalance(wallets);
      const [inflow24h, outflow24h] = await this.getExchange24hFlows(exchange, timestamp, balance);

      exchangeDetails[exchange] = {
        balance,
        inflow_24h: inflow24h,
        outflow_24h: outflow24h,
      };

      totalBalance += balance;
      totalInflow24h += inflow24h;
      totalOutflow24h += outflow24h;
    }));

    exchangeDetails['total'] = {
      balance: totalBalance,
      inflow_24h: totalInflow24h,
      outflow_24h: totalOutflow24h,
    };

    return ExchangesEntity.fromObject(timestamp, exchangeDetails);
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

  private async getExchange24hFlows(exchangeName: string, timestamp: Date, currentBalance: number): Promise<number[]> {
    let inflow24h = 0;
    let outflow24h = 0;

    const previousResult24h = await this.timescaleService.getPreviousValue24h(ExchangesEntity, timestamp, 'balance', exchangeName);
    const balance24h = previousResult24h && previousResult24h > 0 ? currentBalance - previousResult24h : 0;
    if (balance24h >= 0) {
      inflow24h = balance24h;
    } else {
      outflow24h = Math.abs(balance24h);
    }

    return [inflow24h, outflow24h];
  }
}
