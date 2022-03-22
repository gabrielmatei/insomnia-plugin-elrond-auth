import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class TransactionsModel extends CountModel {
  @Field(() => [ScalarValue], { name: 'value_moved', nullable: true })
  valueMoved?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'total_fees', nullable: true })
  totalFees?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'new_emission', nullable: true })
  newEmission?: [ScalarValue];
}
