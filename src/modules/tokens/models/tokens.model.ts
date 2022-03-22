import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class TokensModel extends CountModel {
  @Field(() => [ScalarValue], { name: 'active_tokens', nullable: true })
  active_tokens?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'transfers', nullable: true })
  transfers?: [ScalarValue];
}
