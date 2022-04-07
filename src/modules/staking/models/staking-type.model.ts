import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class StakingTypeModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'value', nullable: true })
  value?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'users', nullable: true })
  users?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'user_average', nullable: true })
  userAverage?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
