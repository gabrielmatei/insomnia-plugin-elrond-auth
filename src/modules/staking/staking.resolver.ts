import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StakingTypeModel } from './models/staking-type.model';
import { StakingModel } from './models/staking.model';

@Resolver(() => StakingModel)
export class StakingResolver {
  @Query(() => StakingModel, { name: 'staking' })
  getBaseModel(): StakingModel {
    return new StakingModel();
  }

  @ResolveField(() => StakingTypeModel, { name: 'total' })
  total(): StakingTypeModel {
    return new StakingTypeModel('total');
  }

  @ResolveField(() => StakingTypeModel, { name: 'staking' })
  staking(): StakingTypeModel {
    return new StakingTypeModel('staking');
  }

  @ResolveField(() => StakingTypeModel, { name: 'delegation' })
  delegation(): StakingTypeModel {
    return new StakingTypeModel('delegation');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation' })
  legacyDelegation(): StakingTypeModel {
    return new StakingTypeModel('legacydelegation');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation_active' })
  legacyDelegationActive(): StakingTypeModel {
    return new StakingTypeModel('legacydelegationactive');
  }

  @ResolveField(() => StakingTypeModel, { name: 'legacy_delegation_waiting_list' })
  legacyDelegationWaitingList(): StakingTypeModel {
    return new StakingTypeModel('legacydelegationwaitinglist');
  }
}
