import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinPriceModel } from './models/coin-price.model';
import { PricesModel } from './models/prices.model';

@Resolver(() => PricesModel)
export class PricesResolver {
  @Query(() => PricesModel, { name: 'prices' })
  getBaseModel(): PricesModel {
    return new PricesModel();
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_usd' })
  getUsdPair(): CoinPriceModel {
    return new CoinPriceModel('usd');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_eur' })
  getEurPair(): CoinPriceModel {
    return new CoinPriceModel('eur');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_btc' })
  getBtcPair(): CoinPriceModel {
    return new CoinPriceModel('btc');
  }

  @ResolveField(() => CoinPriceModel, { name: 'egld_eth' })
  getEthPair(): CoinPriceModel {
    return new CoinPriceModel('eth');
  }
}
