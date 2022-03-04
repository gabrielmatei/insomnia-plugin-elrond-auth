import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { StakingHistoricalBackupEntity } from "src/common/timescale/entities/staking-historical-backup.entity";
import { StakingService } from "src/common/staking/staking.service";

import { stakingActiveList } from "config/temp_stakingWallets.json";

@Injectable()
export class StakingNewIngest implements Ingest {
  public readonly name = StakingNewIngest.name;
  public readonly entityTarget = StakingHistoricalBackupEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly stakingService: StakingService,
  ) { }

  public async fetch(): Promise<StakingHistoricalBackupEntity[]> {
    const { staked } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const delegationWaitingList = await this.stakingService.getDelegationWaitingList();
    const delegationActiveList = await this.stakingService.getDelegationActiveList();
    const delegationTotal = [...delegationWaitingList, ...delegationActiveList].distinct();

    const { totalValue } = await this.stakingService.getTotalDelegated();

    const stakingWaitingList = await this.stakingService.getStakingWaitingList();

    const stakingTotal = stakingActiveList.length + stakingWaitingList.length;
    const stakingUnique = [...new Set([...stakingWaitingList, ...stakingActiveList])];

    const totalList = [...delegationTotal, ...stakingUnique].distinct();

    const legacydelegation = {
      value: totalValue,
      users: delegationTotal.length,
      user_average: Math.floor(totalValue / delegationTotal.length),
    };
    const staking = {
      value: staked,
      users: stakingTotal,
      user_average: staked / stakingTotal,
    };

    const total = {
      value: staking.value,
      users: totalList.length,
      user_average: Math.floor(staking.value / totalList.length),
    };

    const timestamp = moment().utc().toDate();
    return StakingHistoricalBackupEntity.fromObject(timestamp, {
      staking,
      legacydelegation,
      total,
    });
  }
}
