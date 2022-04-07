import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class MaiarDexModel {
  @Field(() => [AggregateValue], { name: 'total_value_locked', nullable: true })
  total_value_locked?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'volume', nullable: true })
  volume?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'mex_burnt', nullable: true })
  mex_burnt?: AggregateValue[];
}
