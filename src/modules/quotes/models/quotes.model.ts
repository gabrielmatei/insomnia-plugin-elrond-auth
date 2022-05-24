import { Field, ObjectType } from "@nestjs/graphql";
import { CoinQuoteModel } from "./coin-quote.model";

@ObjectType()
export class QuotesModel {
  @Field(() => CoinQuoteModel, { name: 'coin', nullable: true })
  coin?: CoinQuoteModel;
}
