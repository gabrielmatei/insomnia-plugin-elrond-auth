import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class StakingTypeModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], { name: 'value', nullable: true })
  value?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'users', nullable: true })
  users?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'user_average', nullable: true })
  userAverage?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
