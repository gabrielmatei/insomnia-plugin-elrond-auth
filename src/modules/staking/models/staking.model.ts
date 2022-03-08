import { Field, ObjectType } from "@nestjs/graphql";
import { StakingTypeModel } from "./staking-type.model";

@ObjectType()
export class StakingModel {
  @Field(() => StakingTypeModel, { name: 'total', nullable: true })
  total?: StakingTypeModel;

  @Field(() => StakingTypeModel, { name: 'staking', nullable: true })
  staking?: StakingTypeModel;

  @Field(() => StakingTypeModel, { name: 'delegation', nullable: true })
  delegation?: StakingTypeModel;

  @Field(() => StakingTypeModel, { name: 'legacy_delegation', nullable: true })
  legacyDelegation?: StakingTypeModel;

  @Field(() => StakingTypeModel, { name: 'legacy_delegation_active', nullable: true })
  legacyDelegationActive?: StakingTypeModel;

  @Field(() => StakingTypeModel, { name: 'legacy_delegation_waiting_list', nullable: true })
  legacyDelegationWaitingList?: StakingTypeModel;
}
