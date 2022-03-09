import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class TransactionsModel {
  @Field(() => [ScalarValue], { name: 'count', nullable: true })
  count?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_24h', nullable: true })
  count24h?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'value_moved', nullable: true })
  valueMoved?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'total_fees', nullable: true })
  totalFees?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'new_emission', nullable: true })
  newEmission?: [ScalarValue];
}
