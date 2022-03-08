import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinQuoteModel } from './models/coin-quote.model';
import { QuotesModel } from './models/quotes.model';

@Resolver(() => QuotesModel)
export class QuotesResolver {
  @Query(() => QuotesModel, { name: 'quotes' })
  async getBaseModel(): Promise<QuotesModel> {
    return new QuotesModel();
  }

  @ResolveField(() => CoinQuoteModel, { name: 'egld' })
  async egld(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('egld');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'btc' })
  async btc(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('btc');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'eth' })
  async eth(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('eth');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'bnb' })
  async bnb(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('bnb');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'busd' })
  async busd(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('busd');
  }

  @ResolveField(() => CoinQuoteModel, { name: 'usdc' })
  async usdc(): Promise<CoinQuoteModel> {
    return new CoinQuoteModel('usdc');
  }
}
