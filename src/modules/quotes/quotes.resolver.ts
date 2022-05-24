import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoinQuoteModel } from './models/coin-quote.model';
import { QuotesCoinEnum } from './models/quotes-coin.enum';
import { QuotesModel } from './models/quotes.model';

@Resolver(() => QuotesModel)
export class QuotesResolver {
  @Query(() => QuotesModel, { name: 'quotes' })
  getBaseModel(): QuotesModel {
    return new QuotesModel();
  }

  @ResolveField(() => CoinQuoteModel, { name: 'coin' })
  getCoin(
    @Args({ name: 'name', type: () => QuotesCoinEnum }) coinName: QuotesCoinEnum
  ): CoinQuoteModel {
    return new CoinQuoteModel(coinName);
  }
}
