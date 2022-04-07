import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class ContractsModel extends CountModel {
  @Field(() => [AggregateValue], { name: 'active_contracts', nullable: true })
  activeContracts?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'transfers', nullable: true })
  transfers?: AggregateValue[];
}
