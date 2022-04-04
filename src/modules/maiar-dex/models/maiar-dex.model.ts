import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class MaiarDexModel {
  @Field(() => [ScalarValue], { name: 'total_value_locked', nullable: true })
  total_value_locked?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'volume', nullable: true })
  volume?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'mex_burnt', nullable: true })
  mex_burnt?: [ScalarValue];
}
