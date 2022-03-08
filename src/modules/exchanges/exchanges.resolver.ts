import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExchangeModel } from './models/exchange.model';
import { ExchangesModel } from './models/exchanges.model';

@Resolver(() => ExchangesModel)
export class ExchangesResolver {
  @Query(() => ExchangesModel, { name: 'exchanges' })
  async getExchanges(): Promise<ExchangesModel> {
    return new ExchangesModel();
  }

  @ResolveField(() => ExchangeModel, { name: 'total' })
  async getTotalExchanges(): Promise<ExchangeModel> {
    return new ExchangeModel('total');
  }

  @ResolveField(() => ExchangeModel, { name: 'binance_com' })
  async getBinanceComExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Binance.com');
  }

  @ResolveField(() => ExchangeModel, { name: 'binance_us' })
  async getBinanceUsExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Binance.us');
  }

  @ResolveField(() => ExchangeModel, { name: 'bitfinex' })
  async getBitfinexExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Bitfinex');
  }

  @ResolveField(() => ExchangeModel, { name: 'bithumb' })
  async getBithumbExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Bithumb');
  }

  @ResolveField(() => ExchangeModel, { name: 'bitmax' })
  async getBitmaxExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Bitmax');
  }

  @ResolveField(() => ExchangeModel, { name: 'crypto_com' })
  async getCryptoComExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Crypto.com');
  }

  @ResolveField(() => ExchangeModel, { name: 'kucoin' })
  async getKucoinExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Kucoin');
  }

  @ResolveField(() => ExchangeModel, { name: 'liquid' })
  async getLiquidExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Liquid');
  }

  @ResolveField(() => ExchangeModel, { name: 'okex' })
  async getOkexExchange(): Promise<ExchangeModel> {
    return new ExchangeModel('Okex');
  }
}
