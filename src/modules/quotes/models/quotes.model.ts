import { Field, ObjectType } from "@nestjs/graphql";
import { CoinQuoteModel } from "./coin-quote.model";

@ObjectType()
export class QuotesModel {
  @Field(() => CoinQuoteModel, { name: 'egld', nullable: true })
  egld?: CoinQuoteModel;

  @Field(() => CoinQuoteModel, { name: 'btc', nullable: true })
  btc?: CoinQuoteModel;

  @Field(() => CoinQuoteModel, { name: 'eth', nullable: true })
  eth?: CoinQuoteModel;

  @Field(() => CoinQuoteModel, { name: 'bnb', nullable: true })
  bnb?: CoinQuoteModel;

  @Field(() => CoinQuoteModel, { name: 'busd', nullable: true })
  busd?: CoinQuoteModel;

  @Field(() => CoinQuoteModel, { name: 'usdc', nullable: true })
  usdc?: CoinQuoteModel;
}
