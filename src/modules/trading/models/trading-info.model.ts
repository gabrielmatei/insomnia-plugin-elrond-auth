import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class TradingInfoModel {
  @HideField()
  firstToken: string;

  @HideField()
  secondToken: string;

  @Field(() => [AggregateValue], { name: 'price', nullable: true })
  price?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'volume', nullable: true })
  volume?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'fee', nullable: true })
  fee?: AggregateValue[];

  constructor(firstToken: string, secondToken: string) {
    this.firstToken = firstToken;
    this.secondToken = secondToken;
  }
}
