import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GatewayService } from "src/common/gateway/gateway.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { AddressUtils } from "src/utils/address.utils";
import { NumberUtils } from "src/utils/number.utils";
import { StakingEntity } from "./staking.entity";

import { stakingActiveList } from "./temp_stakingWallets.json";

@Injectable()
export class StakingIngest implements Ingest {
  public readonly name = StakingIngest.name;
  public readonly entityTarget = StakingEntity;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;
  private readonly gatewayService: GatewayService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService, gatewayService: GatewayService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;
    this.gatewayService = gatewayService;
  }

  public async fetch(): Promise<StakingEntity[]> {
    const { staked } = await this.apiService.get(`${this.apiConfigService.getApiUrl()}/economics`);

    const delegationWaitingList = await this.getDelegationWaitingList();
    const delegationActiveList = await this.getDelegationActiveList();
    const delegationTotal = [...delegationWaitingList, ...delegationActiveList].distinct();

    const totalValue = await this.getTotalDelegated();

    const stakingWaitingList = await this.getStakingWaitingList();

    const stakingTotal = stakingActiveList.length + stakingWaitingList.length;
    const stakingUnique = [...new Set([...stakingWaitingList, ...stakingActiveList])];

    const totalList = [...delegationTotal, ...stakingUnique].distinct();

    const legacyDelegation = {
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
    return StakingEntity.fromObject(timestamp, {
      staking,
      legacyDelegation,
      total,
    });
  }

  private async getStakingWaitingList() {
    // TODO
    const stakingWaitingListEncoded = await this.gatewayService.vmQuery(
      this.apiConfigService.getStakingContract(),
      'getQueueRegisterNonceAndRewardAddress',
      this.apiConfigService.getAuctionContract()
    );

    const stakingWaitingList = stakingWaitingListEncoded.reduce(
      (result, _value, index, array) => {
        if (index % 3 === 0) {
          try {
            const [_value, publicKeyEncoded] = array.slice(index, index + 3);

            const publicKey = Buffer.from(publicKeyEncoded, 'base64').toString();
            const address = AddressUtils.bech32Encode(publicKey);

            result.push(address);
          } catch { }
        }

        return result;
      },
      [] as string[]
    );
    return stakingWaitingList;
  }

  private async getTotalDelegated(): Promise<number> {
    const totalDelegatedEncoded = await this.gatewayService.vmQuery(
      this.apiConfigService.getDelegationContract(),
      'getTotalStakeByType',
    );

    const [
      _totalWithdrawOnlyDelegate,
      totalWaitingDelegate,
      totalActiveDelegate,
      _totalUnDelegatedDelegate,
      _totalDeferredPaymentDelegate,
    ] = totalDelegatedEncoded.map((encoded) => NumberUtils.numberDecode(encoded));

    const activeValue = parseInt(totalActiveDelegate.slice(0, -18));
    const waitingListValue = parseInt(totalWaitingDelegate.slice(0, -18));

    const totalValue = activeValue + waitingListValue;
    return totalValue;
  }

  private async getDelegationActiveList(): Promise<string[]> {
    const delegationActiveListEncoded = await this.gatewayService.vmQuery(
      this.apiConfigService.getDelegationContract(),
      'getFullActiveList',
    );

    const delegationActiveList = delegationActiveListEncoded.reduce(
      (result, _value, index, array) => {
        if (index % 2 === 0) {
          const [publicKeyEncoded] = array.slice(index, index + 2);

          const publicKey = Buffer.from(publicKeyEncoded, 'base64').toString('hex');
          const address = AddressUtils.bech32Encode(publicKey);

          result.push(address);
        }
        return result;
      },
      [] as string[]
    );

    const distinctDelegationActiveList = delegationActiveList.distinct();
    return distinctDelegationActiveList;
  }

  private async getDelegationWaitingList(): Promise<string[]> {
    const delegationWaitingListEncoded = await this.gatewayService.vmQuery(
      this.apiConfigService.getDelegationContract(),
      'getFullWaitingList',
    );

    const delegationWaitingList = delegationWaitingListEncoded.reduce(
      (result, _value, index, array) => {
        if (index % 3 === 0) {
          const [publicKeyEncoded] = array.slice(index, index + 3);

          const publicKey = Buffer.from(publicKeyEncoded, 'base64').toString('hex');
          const address = AddressUtils.bech32Encode(publicKey);

          result.push(address);
        }
        return result;
      },
      [] as string[]
    );

    const distinctDelegationWaitingList = delegationWaitingList.distinct();
    return distinctDelegationWaitingList;
  }
}
