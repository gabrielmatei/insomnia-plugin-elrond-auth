import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class TwitterModel {
  @Field(() => [AggregateValue], { name: 'mentions', nullable: true })
  mentions?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'followers', nullable: true })
  followers?: AggregateValue[];
}
