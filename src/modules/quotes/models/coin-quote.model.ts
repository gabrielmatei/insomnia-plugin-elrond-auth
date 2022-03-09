import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class CoinQuoteModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], { name: 'price', nullable: true })
  price?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'market_cap', nullable: true })
  marketCap?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'volume_24h', nullable: true })
  volume24h?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
