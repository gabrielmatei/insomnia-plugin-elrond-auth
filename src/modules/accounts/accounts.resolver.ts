import { Resolver, ResolveField, Query, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { AccountsEntity } from "src/common/timescale/entities/accounts.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { AccountsModel } from "./models/accounts.model";
import { ThresholdCountModel } from "./models/threshold-count.model";

@Resolver(() => AccountsModel)
export class AccountsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => AccountsModel, { name: 'accounts' })
  async getBaseModel(): Promise<AccountsModel> {
    return new AccountsModel();
  }

  @ResolveField(() => [ScalarValue], { name: 'count' })
  public async count(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'accounts', 'count', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(@Args('input') query: QueryInput): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'accounts', 'count_24h', query);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'balance' })
  async balance(): Promise<ThresholdCountModel<AccountsHistoricalEntity>> {
    return new ThresholdCountModel('balance', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'delegation_legacy_active' })
  async delegation_legacy_active(): Promise<ThresholdCountModel<AccountsHistoricalEntity>> {
    return new ThresholdCountModel('delegationlegacyactive', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'delegation' })
  async delegation(): Promise<ThresholdCountModel<AccountsHistoricalEntity>> {
    return new ThresholdCountModel('delegation', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'total_balance_with_stake' })
  async total_balance_with_stake(): Promise<ThresholdCountModel<AccountsHistoricalEntity>> {
    return new ThresholdCountModel('totalbalancewithstake', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'total_stake' })
  async total_stake(): Promise<ThresholdCountModel<AccountsHistoricalEntity>> {
    return new ThresholdCountModel('totalstake', AccountsHistoricalEntity);
  }
}
