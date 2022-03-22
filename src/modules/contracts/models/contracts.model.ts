import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class ContractsModel extends CountModel {
  @Field(() => [ScalarValue], { name: 'active_contracts', nullable: true })
  activeContracts?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'transfers', nullable: true })
  transfers?: [ScalarValue];
}
