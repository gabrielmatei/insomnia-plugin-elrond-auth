import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class KeywordModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'clicks', nullable: true })
  clicks?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'impressions', nullable: true })
  impressions?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'ctr', nullable: true })
  ctr?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'position', nullable: true })
  position?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
