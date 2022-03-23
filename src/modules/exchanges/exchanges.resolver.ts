import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ExchangeModel } from './models/exchange.model';
import { ExchangesModel } from './models/exchanges.model';

@Resolver(() => ExchangesModel)
export class ExchangesResolver {
  @Query(() => ExchangesModel, { name: 'exchanges' })
  getBaseModel(): ExchangesModel {
    return new ExchangesModel();
  }

  @ResolveField(() => ExchangeModel, { name: 'total' })
  getTotalExchanges(): ExchangeModel {
    return new ExchangeModel('total');
  }

  @ResolveField(() => ExchangeModel, { name: 'binance_com' })
  getBinanceComExchange(): ExchangeModel {
    return new ExchangeModel('Binance.com');
  }

  @ResolveField(() => ExchangeModel, { name: 'binance_us' })
  getBinanceUsExchange(): ExchangeModel {
    return new ExchangeModel('Binance.us');
  }

  @ResolveField(() => ExchangeModel, { name: 'bitfinex' })
  getBitfinexExchange(): ExchangeModel {
    return new ExchangeModel('Bitfinex');
  }

  @ResolveField(() => ExchangeModel, { name: 'bithumb' })
  getBithumbExchange(): ExchangeModel {
    return new ExchangeModel('Bithumb');
  }

  @ResolveField(() => ExchangeModel, { name: 'bitmax' })
  getBitmaxExchange(): ExchangeModel {
    return new ExchangeModel('Bitmax');
  }

  @ResolveField(() => ExchangeModel, { name: 'crypto_com' })
  getCryptoComExchange(): ExchangeModel {
    return new ExchangeModel('Crypto.com');
  }

  @ResolveField(() => ExchangeModel, { name: 'kucoin' })
  getKucoinExchange(): ExchangeModel {
    return new ExchangeModel('Kucoin');
  }

  @ResolveField(() => ExchangeModel, { name: 'liquid' })
  getLiquidExchange(): ExchangeModel {
    return new ExchangeModel('Liquid');
  }

  @ResolveField(() => ExchangeModel, { name: 'okex' })
  getOkexExchange(): ExchangeModel {
    return new ExchangeModel('Okex');
  }
}
