import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class CoinPriceModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'current_price', nullable: true })
  currentPrice?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'market_cap', nullable: true })
  marketCap?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'high_24h', nullable: true })
  high24h?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'total_volume', nullable: true })
  total_volume?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
