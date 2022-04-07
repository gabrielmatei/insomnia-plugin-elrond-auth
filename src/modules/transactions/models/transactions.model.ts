import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class TransactionsModel extends CountModel {
  @Field(() => [AggregateValue], { name: 'value_moved', nullable: true })
  valueMoved?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'total_fees', nullable: true })
  totalFees?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'new_emission', nullable: true })
  newEmission?: AggregateValue[];
}
