import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinModel } from './models/coin.model';
import { PricesModel } from './models/prices.model';

@Resolver(() => PricesModel)
export class PricesResolver {
  @Query(() => PricesModel, { name: 'prices' })
  async getPrices(): Promise<PricesModel> {
    return new PricesModel();
  }

  @ResolveField(() => CoinModel, { name: 'egld_usd' })
  async getUsdPair(): Promise<CoinModel> {
    return new CoinModel('usd');
  }

  @ResolveField(() => CoinModel, { name: 'egld_eur' })
  async getEurPair(): Promise<CoinModel> {
    return new CoinModel('eur');
  }

  @ResolveField(() => CoinModel, { name: 'egld_btc' })
  async getBtcPair(): Promise<CoinModel> {
    return new CoinModel('btc');
  }

  @ResolveField(() => CoinModel, { name: 'egld_eth' })
  async getEthPair(): Promise<CoinModel> {
    return new CoinModel('eth');
  }
}
