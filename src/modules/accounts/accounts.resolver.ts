import { Resolver, ResolveField, Query, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { AccountsEntity } from "src/common/timescale/entities/accounts.entity";
import { TransactionsDetailedEntity } from "src/common/timescale/entities/transactions-detailed.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
import { QueryInput } from "../models/query.input";
import { AccountsModel } from "./models/accounts.model";
import { ThresholdCountModel } from "./models/threshold-count.model";

@Resolver(() => AccountsModel)
export class AccountsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => AccountsModel, { name: 'accounts' })
  getBaseModel(): AccountsModel {
    return new AccountsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'count' })
  public async count(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'accounts', 'count', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'accounts', 'count_24h', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'active_accounts' })
  public async active_accounts(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(TransactionsDetailedEntity, 'accounts', 'active_accounts', query, aggregates);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'balance' })
  balance(): ThresholdCountModel<AccountsHistoricalEntity> {
    return new ThresholdCountModel('balance', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'delegation_legacy_active' })
  delegation_legacy_active(): ThresholdCountModel<AccountsHistoricalEntity> {
    return new ThresholdCountModel('delegationlegacyactive', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'delegation' })
  delegation(): ThresholdCountModel<AccountsHistoricalEntity> {
    return new ThresholdCountModel('delegation', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'total_balance_with_stake' })
  total_balance_with_stake(): ThresholdCountModel<AccountsHistoricalEntity> {
    return new ThresholdCountModel('totalbalancewithstake', AccountsHistoricalEntity);
  }

  @ResolveField(() => ThresholdCountModel, { name: 'total_stake' })
  total_stake(): ThresholdCountModel<AccountsHistoricalEntity> {
    return new ThresholdCountModel('totalstake', AccountsHistoricalEntity);
  }
}
