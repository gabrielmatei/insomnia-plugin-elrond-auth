import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class EconomicsModel {
  @Field(() => [ScalarValue], { name: 'total_supply', nullable: true })
  totalSupply?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'circulating_supply', nullable: true })
  circulatingSupply?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'floating_supply', nullable: true })
  floatingSupply?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'staked', nullable: true })
  staked?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'left_per_user', nullable: true })
  leftPerUser?: [ScalarValue];
}
