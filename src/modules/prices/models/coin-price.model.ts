import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class CoinPriceModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], {
    name: 'current_price',
    nullable: true,
  })
  currentPrice?: [ScalarValue];

  @Field(() => [ScalarValue], {
    name: 'market_cap',
    nullable: true,
  })
  marketCap?: [ScalarValue];

  @Field(() => [ScalarValue], {
    name: 'high_24h',
    nullable: true,
  })
  high24h?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
