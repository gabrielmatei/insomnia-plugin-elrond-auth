import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class TrendsModel {
  @Field(() => [AggregateValue], { name: 'google', nullable: true })
  google?: AggregateValue[];
}
