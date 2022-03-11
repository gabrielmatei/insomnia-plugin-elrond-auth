import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class ContractsModel {
  @Field(() => [ScalarValue], { name: 'count', nullable: true })
  count?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_24h', nullable: true })
  count24?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'active_contracts', nullable: true })
  activeContracts?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'transfers', nullable: true })
  transfers?: [ScalarValue];
}
