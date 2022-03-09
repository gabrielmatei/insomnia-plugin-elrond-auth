import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinPriceModel } from './models/coin-price.model';
import { PricesModel } from './models/prices.model';

@Resolver(() => PricesModel)
export class PricesResolver {
  @Query(() => PricesModel, { name: 'prices' })
  async getPrices(): Promise<PricesModel> {
    return new PricesModel();
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_usd' })
  async getUsdPair(): Promise<CoinPriceModel> {
    return new CoinPriceModel('usd');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_eur' })
  async getEurPair(): Promise<CoinPriceModel> {
    return new CoinPriceModel('eur');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_btc' })
  async getBtcPair(): Promise<CoinPriceModel> {
    return new CoinPriceModel('btc');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_eth' })
  async getEthPair(): Promise<CoinPriceModel> {
    return new CoinPriceModel('eth');
  }
}
