import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class EconomicsModel {
  @Field(() => [AggregateValue], { name: 'total_supply', nullable: true })
  totalSupply?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'circulating_supply', nullable: true })
  circulatingSupply?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'floating_supply', nullable: true })
  floatingSupply?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'staked', nullable: true })
  staked?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'left_per_user', nullable: true })
  leftPerUser?: AggregateValue[];
}
