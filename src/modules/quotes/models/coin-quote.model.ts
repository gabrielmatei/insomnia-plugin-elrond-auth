import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class CoinQuoteModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'price', nullable: true })
  price?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'market_cap', nullable: true })
  marketCap?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'volume_24h', nullable: true })
  volume24h?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
