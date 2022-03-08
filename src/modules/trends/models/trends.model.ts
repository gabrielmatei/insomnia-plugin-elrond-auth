import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class TrendsModel {
  @Field(() => [ScalarValue], {
    name: 'google',
    nullable: true,
  })
  google?: [ScalarValue];
}
