import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StakingTypeModel } from './models/staking-type.model';
import { StakingModel } from './models/staking.model';

@Resolver(() => StakingModel)
export class StakingResolver {
  @Query(() => StakingModel, { name: 'staking' })
  async getBaseModel(): Promise<StakingModel> {
    return new StakingModel();
  }

  @ResolveField(() => StakingTypeModel, { name: 'total' })
  async total(): Promise<StakingTypeModel> {
    return new StakingTypeModel('total');
  }

  @ResolveField(() => StakingTypeModel, { name: 'staking' })
  async staking(): Promise<StakingTypeModel> {
    return new StakingTypeModel('staking');
  }

  @ResolveField(() => StakingTypeModel, { name: 'delegation' })
  async delegation(): Promise<StakingTypeModel> {
    return new StakingTypeModel('delegation');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation' })
  async legacyDelegation(): Promise<StakingTypeModel> {
    return new StakingTypeModel('legacydelegation');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation_active' })
  async legacyDelegationActive(): Promise<StakingTypeModel> {
    return new StakingTypeModel('legacydelegationactive');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation_waiting_list' })
  async legacyDelegationWaitingList(): Promise<StakingTypeModel> {
    return new StakingTypeModel('legacydelegationwaitinglist');
  }
}
