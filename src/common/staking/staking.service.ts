import { Injectable } from "@nestjs/common";
import { AddressUtils } from "src/utils/address.utils";
import { NumberUtils } from "src/utils/number.utils";
import { ApiConfigService } from "../api-config/api.config.service";
import { GatewayService } from "../gateway/gateway.service";

@Injectable()
export class StakingService {

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly gatewayService: GatewayService,
  ) { }

  public async getStakingWaitingList() {
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  public async getTotalDelegated(): Promise<{ totalValue: number, activeValue: number, waitingListValue: number }> {
    const totalDelegatedEncoded = await this.gatewayService.vmQuery(
      this.apiConfigService.getDelegationContract(),
      'getTotalStakeByType',
    );

    const [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _totalWithdrawOnlyDelegate,
      totalWaitingDelegate,
      totalActiveDelegate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _totalUnDelegatedDelegate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _totalDeferredPaymentDelegate,
    ] = totalDelegatedEncoded.map((encoded) => NumberUtils.numberDecode(encoded));

    const activeValue = parseInt(totalActiveDelegate.slice(0, -18));
    const waitingListValue = parseInt(totalWaitingDelegate.slice(0, -18));

    const totalValue = activeValue + waitingListValue;
    return { totalValue, activeValue, waitingListValue };
  }

  public async getDelegationActiveList(): Promise<string[]> {
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

  public async getDelegationWaitingList(): Promise<string[]> {
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
