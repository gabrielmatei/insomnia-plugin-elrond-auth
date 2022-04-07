import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class CountModel {
  @Field(() => [AggregateValue], { name: 'count', nullable: true })
  count?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_24h', nullable: true })
  count24h?: AggregateValue[];
}
