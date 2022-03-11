import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class TokensModel {
  @Field(() => [ScalarValue], { name: 'count', nullable: true })
  count?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_24h', nullable: true })
  count24h?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'active_tokens', nullable: true })
  active_tokens?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'transfers', nullable: true })
  transfers?: [ScalarValue];
}
