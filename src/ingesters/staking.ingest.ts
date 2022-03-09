import { Injectable } from "@nestjs/common";
import moment from "moment";
import { StakingService } from "src/common/staking/staking.service";
import { StakingEntity } from "src/common/timescale/entities/staking.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { NumberUtils } from "src/utils/number.utils";

import { stakingActiveList } from "config/temp_stakingWallets.json";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class StakingIngest implements Ingest {
  public readonly name = StakingIngest.name;
  public readonly entityTarget = StakingEntity;

  constructor(
    private readonly stakingService: StakingService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const delegationWaitingList = await this.stakingService.getDelegationWaitingList();
    const delegationActiveList = await this.stakingService.getDelegationActiveList();
    const delegationTotal = [...delegationWaitingList, ...delegationActiveList].distinct();

    const { totalValue, activeValue, waitingListValue } = await this.stakingService.getTotalDelegated();

    const stakingWaitingList = await this.stakingService.getStakingWaitingList();
    const stakingTotal = stakingActiveList.length + stakingWaitingList.length;
    const stakingUnique = [...new Set([...stakingWaitingList, ...stakingActiveList])];

    const totalList = [...delegationTotal, ...stakingUnique].distinct();
    const totalActiveList = [...delegationActiveList, ...stakingActiveList].distinct();
    const totalWaitingList = [...delegationWaitingList, ...stakingWaitingList].distinct();

    const delegation = {
      active: delegationActiveList.length,
      waiting_list: delegationWaitingList.length,
      count: delegationTotal.length,
      active_value: activeValue,
      waiting_list_value: waitingListValue,
      total_value: totalValue,
      active_user_average: NumberUtils.tryIntegerDivision(activeValue, delegationActiveList.length),
      waiting_list_user_average: NumberUtils.tryIntegerDivision(waitingListValue, delegationWaitingList.length),
      user_average: NumberUtils.tryIntegerDivision(totalValue, delegationTotal.length),
    };
    const staking = {
      active: [...new Set(stakingActiveList)].length,
      waiting_list: [...new Set(stakingWaitingList)].length,
      count: stakingTotal,
      active_value: stakingActiveList.length * 2500,
      waiting_list_value: stakingWaitingList.length * 2500,
      total_value: stakingTotal * 2500,
      active_user_average: NumberUtils.tryIntegerDivision(stakingActiveList.length * 2500, stakingActiveList.length),
      waiting_list_user_average: NumberUtils.tryIntegerDivision(stakingWaitingList.length * 2500, stakingWaitingList.length),
      user_average: NumberUtils.tryIntegerDivision(stakingTotal * 2500, stakingTotal),
    };
    const total = {
      active: totalActiveList.length,
      waiting_list: totalWaitingList.length,
      count: totalList.length,
      active_value: delegation.active_value + staking.active_value,
      waiting_list_value: delegation.waiting_list_value + staking.waiting_list_value,
      total_value: delegation.waiting_list_value + staking.total_value,
      active_user_average: NumberUtils.tryIntegerDivision(delegation.active_value + staking.active_value, totalActiveList.length),
      waiting_list_user_average: NumberUtils.tryIntegerDivision(delegation.waiting_list_value + staking.waiting_list_value, totalWaitingList.length),
      user_average: NumberUtils.tryIntegerDivision(delegation.waiting_list_value + staking.total_value, totalList.length),
    };

    const data = {
      delegation,
      staking,
      total,
    };
    return {
      current: {
        entity: StakingEntity,
        records: StakingEntity.fromObject(timestamp, data),
      },
    };
  }
}
