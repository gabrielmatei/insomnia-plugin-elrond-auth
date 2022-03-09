import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class TwitterModel {
  @Field(() => [ScalarValue], { name: 'mentions', nullable: true })
  mentions?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'followers', nullable: true })
  followers?: [ScalarValue];
}
