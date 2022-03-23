import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinQuoteModel } from './models/coin-quote.model';
import { QuotesModel } from './models/quotes.model';

@Resolver(() => QuotesModel)
export class QuotesResolver {
  @Query(() => QuotesModel, { name: 'quotes' })
  getBaseModel(): QuotesModel {
    return new QuotesModel();
  }

  @ResolveField(() => CoinQuoteModel, { name: 'egld' })
  egld(): CoinQuoteModel {
    return new CoinQuoteModel('egld');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'btc' })
  btc(): CoinQuoteModel {
    return new CoinQuoteModel('btc');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'eth' })
  eth(): CoinQuoteModel {
    return new CoinQuoteModel('eth');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'bnb' })
  bnb(): CoinQuoteModel {
    return new CoinQuoteModel('bnb');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'busd' })
  busd(): CoinQuoteModel {
    return new CoinQuoteModel('busd');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'usdc' })
  usdc(): CoinQuoteModel {
    return new CoinQuoteModel('usdc');
  }
}
