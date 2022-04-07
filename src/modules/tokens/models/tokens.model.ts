import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class TokensModel extends CountModel {
  @Field(() => [AggregateValue], { name: 'active_tokens', nullable: true })
  active_tokens?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'transfers', nullable: true })
  transfers?: AggregateValue[];
}
