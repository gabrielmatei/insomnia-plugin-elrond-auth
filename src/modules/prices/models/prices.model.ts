import { Field, ObjectType } from "@nestjs/graphql";
import { CoinPriceModel } from "./coin-price.model";

@ObjectType()
export class PricesModel {
  @Field(() => CoinPriceModel, {
    name: 'egld_usd',
    nullable: true,
  })
  usd?: CoinPriceModel;

  @Field(() => CoinPriceModel, {
    name: 'egld_eur',
    nullable: true,
  })
  eur?: CoinPriceModel;

  @Field(() => CoinPriceModel, {
    name: 'egld_btc',
    nullable: true,
  })
  btc?: CoinPriceModel;

  @Field(() => CoinPriceModel, {
    name: 'egld_eth',
    nullable: true,
  })
  eth?: CoinPriceModel;
}
