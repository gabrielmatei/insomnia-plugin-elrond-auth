import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { StakingDetailedEntity } from "./staking-detailed.entity";

export class StakingDetailedIngest implements Ingest {
  public readonly name = StakingDetailedIngest.name;
  public readonly entityTarget = StakingDetailedEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;
  private readonly gatewayService: GatewayService;
  private readonly elasticService: ElasticService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService, gatewayService: GatewayService, elasticService: ElasticService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
    this.gatewayService = gatewayService;
    this.elasticService = elasticService;
  }

  public async fetch(): Promise<StakingDetailedEntity[]> {
    const epoch = await this.gatewayService.getEpoch();

    const { staked: totalStaked } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const [delegationLegacyWaiting, delegationLegacyActive, delegationLegacyUnstaked] = await this.getDelegationLegacyTotal();
    const delegationLegacyTotal = delegationLegacyActive + delegationLegacyUnstaked + delegationLegacyWaiting;

    const [
      delegationStake,
      delegationTopup,
      delegationLocked,
    ] = await this.getDelegationTotal();

    const [
      totalUniqueUsers,
      delegationUsers,
      delegationLegacyActiveUsers,
      delegationLegacyWaitingUsers,
    ] = await Promise.all([
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalStakeNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationLegacyActiveNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getInternalElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationLegacyWaitingNum', { gt: 0 }),
        ])),
    ]);

    const [
      {
        count: stakingUsers,
      },
      {
        count: delegationLegacyUsers,
      },
      {
        aggregations: {
          delegationTotal: { value: totalDelegated },
        },
      },
    ] = await Promise.all([
      this.apiService.post<any, any>(`${this.apiConfigService.getInternalElasticUrl()}/accounts-000001_${epoch}/_count`, {
        query: {
          bool: {
            should: [
              {
                range: {
                  delegationNum: {
                    gt: 0,
                  },
                },
              },
              {
                range: {
                  delegationLegacyActiveNum: {
                    gt: 0,
                  },
                },
              },
            ],
          },
        },
      }),
      this.apiService.post<any, any>(`${this.apiConfigService.getInternalElasticUrl()}/accounts-000001_${epoch}/_count`, {
        query: {
          bool: {
            should: [
              {
                range: {
                  delegationLegacyWaitingNum: {
                    gt: 0,
                  },
                },
              },
              {
                range: {
                  delegationLegacyActiveNum: {
                    gt: 0,
                  },
                },
              },
            ],
          },
        },
      }),
      this.apiService.post<any, any>(`${this.apiConfigService.getInternalElasticUrl()}/accounts-000001_${epoch}/_search`, {
        aggs: {
          delegationTotal: { sum: { field: 'delegationNum' } },
        },
      }),
    ]);
    const legacyDelegationUserAverage = Math.floor(
      isNaN(delegationLegacyTotal / delegationLegacyUsers) || delegationLegacyUsers === 0
        ? 0
        : delegationLegacyTotal / delegationLegacyUsers
    );
    const legacyDelegationActiveUserAverage = Math.floor(
      isNaN(delegationLegacyActive / delegationLegacyActiveUsers) ||
        delegationLegacyActiveUsers === 0
        ? 0
        : delegationLegacyActive / delegationLegacyActiveUsers
    );
    const legacyDelegationWaitingUserAverage = Math.floor(
      isNaN(delegationLegacyWaiting / delegationLegacyWaitingUsers) ||
        delegationLegacyWaitingUsers === 0
        ? 0
        : delegationLegacyWaiting / delegationLegacyWaitingUsers
    );
    const delegationUserAverage = Math.floor(
      isNaN(totalDelegated / delegationUsers) || delegationUsers === 0
        ? 0
        : totalDelegated / delegationUsers
    );
    const stakingUserAverage = Math.floor(
      isNaN(delegationLocked / stakingUsers) || stakingUsers === 0
        ? 0
        : delegationLocked / stakingUsers
    );
    const userAverage = Math.floor(
      isNaN(totalStaked / totalUniqueUsers) || totalUniqueUsers === 0
        ? 0
        : totalStaked / totalUniqueUsers
    );

    const data = {
      legacydelegation: {
        value: delegationLegacyTotal,
        users: delegationLegacyUsers,
        user_average: legacyDelegationUserAverage,
      },
      legacydelegationactive: {
        value: delegationLegacyActive,
        users: delegationLegacyActiveUsers,
        user_average: legacyDelegationActiveUserAverage,
      },
      legacydelegationwaitinglist: {
        value: delegationLegacyWaiting,
        users: delegationLegacyWaitingUsers,
        user_average: legacyDelegationWaitingUserAverage,
      },
      delegation: {
        value: parseInt(totalDelegated),
        users: delegationUsers,
        user_average: delegationUserAverage,
      },
      staking: {
        stake: delegationStake,
        topup: delegationTopup,
        value: delegationLocked,
        users: stakingUsers,
        user_average: stakingUserAverage,
      },
      total: {
        value: totalStaked,
        users: totalUniqueUsers,
        user_average: userAverage,
      },
    };

    const timestamp = moment.utc().subtract(1, 'days').toDate();
    return StakingDetailedEntity.fromObject(timestamp, data);
  }

  private async getDelegationLegacyTotal(): Promise<number[]> {
    const {
      totalWaitingStake,
      totalActiveStake,
      totalUnstakedStake,
    } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/delegation-legacy`);

    const delegationLegacyWaiting = parseInt(totalWaitingStake.length > 1 ? totalWaitingStake.slice(0, -18) : 0);
    const delegationLegacyActive = parseInt(totalActiveStake.length > 1 ? totalActiveStake.slice(0, -18) : 0);
    const delegationLegacyUnstaked = parseInt(totalUnstakedStake.length > 1 ? totalUnstakedStake.slice(0, -18) : 0);

    return [delegationLegacyWaiting, delegationLegacyActive, delegationLegacyUnstaked];
  }

  private async getDelegationTotal(): Promise<number[]> {
    const {
      stake,
      topUp,
      locked,
    } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/delegation`);

    const delegationStake = parseInt(stake.length > 1 ? stake.slice(0, -18) : 0);
    const delegationTopup = parseInt(topUp.length > 1 ? topUp.slice(0, -18) : 0);
    const delegationLocked = parseInt(locked.length > 1 ? locked.slice(0, -18) : 0);

    return [delegationStake, delegationTopup, delegationLocked];
  }
}
