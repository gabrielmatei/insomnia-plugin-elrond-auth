import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class NftsModel extends CountModel {
  @Field(() => [AggregateValue], { name: 'active_nfts', nullable: true })
  active_nfts?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'transfers', nullable: true })
  transfers?: AggregateValue[];
}
