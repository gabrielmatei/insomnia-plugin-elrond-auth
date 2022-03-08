import { Field, ObjectType } from "@nestjs/graphql";
import { CoinModel } from "./coin.model";

@ObjectType()
export class PricesModel {
  @Field(() => CoinModel, {
    name: 'egld_usd',
    nullable: true,
  })
  usd?: CoinModel;

  @Field(() => CoinModel, {
    name: 'egld_eur',
    nullable: true,
  })
  eur?: CoinModel;

  @Field(() => CoinModel, {
    name: 'egld_btc',
    nullable: true,
  })
  btc?: CoinModel;

  @Field(() => CoinModel, {
    name: 'egld_eth',
    nullable: true,
  })
  eth?: CoinModel;
}
