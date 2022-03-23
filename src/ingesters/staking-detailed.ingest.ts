import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { QueryConditionOptions } from "src/common/elastic/entities/query.condition.options";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { StakingHistoricalEntity } from "src/common/timescale/entities/staking-historical.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";
import { NumberUtils } from "src/utils/number.utils";

@Injectable()
export class StakingDetailedIngest implements Ingest {
  public readonly name = StakingDetailedIngest.name;
  public readonly entityTarget = StakingHistoricalEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly gatewayService: GatewayService,
    private readonly elasticService: ElasticService,
  ) { }

  public async fetch(): Promise<IngestRecords[]> {
    const epoch = await this.gatewayService.getEpoch();
    const timestamp = moment.utc().startOf('day').subtract(1, 'days').toDate();

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
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('totalStakeNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationLegacyActiveNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withFilter([
          new RangeQuery('delegationLegacyWaitingNum', { gt: 0 }),
        ])),
    ]);

    const [
      stakingUsers,
      delegationLegacyUsers,
      {
        aggregations: {
          delegationTotal: { value: totalDelegated },
        },
      },
    ] = await Promise.all([
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withCondition(QueryConditionOptions.should, [
          new RangeQuery('delegationNum', { gt: 0 }),
          new RangeQuery('delegationLegacyActiveNum', { gt: 0 }),
        ])),
      this.elasticService.getCount(
        this.apiConfigService.getElasticUrl(),
        `accounts-000001_${epoch}`,
        ElasticQuery.create().withCondition(QueryConditionOptions.should, [
          new RangeQuery('delegationLegacyWaitingNum', { gt: 0 }),
          new RangeQuery('delegationLegacyActiveNum', { gt: 0 }),
        ])),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.apiService.post<any, any>(`${this.apiConfigService.getElasticUrl()}/accounts-000001_${epoch}/_search`, {
        aggs: {
          delegationTotal: { sum: { field: 'delegationNum' } },
        },
      }),
    ]);

    const legacyDelegationUserAverage = NumberUtils.tryIntegerDivision(delegationLegacyTotal, delegationLegacyUsers);
    const legacyDelegationActiveUserAverage = NumberUtils.tryIntegerDivision(delegationLegacyActive, delegationLegacyActiveUsers);
    const legacyDelegationWaitingUserAverage = NumberUtils.tryIntegerDivision(delegationLegacyWaiting, delegationLegacyWaitingUsers);
    const delegationUserAverage = NumberUtils.tryIntegerDivision(totalDelegated, delegationUsers);
    const stakingUserAverage = NumberUtils.tryIntegerDivision(delegationLocked, stakingUsers);
    const userAverage = NumberUtils.tryIntegerDivision(totalStaked, totalUniqueUsers);

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
    return [{
      entity: StakingHistoricalEntity,
      records: StakingHistoricalEntity.fromObject(timestamp, data),
    }];
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
