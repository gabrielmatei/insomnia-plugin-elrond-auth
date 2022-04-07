import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { CountModel } from "src/modules/models/count.model";
import { ThresholdCountModel } from "./threshold-count.model";

@ObjectType()
export class AccountsModel extends CountModel {
  @Field(() => [AggregateValue], { name: 'active_accounts', nullable: true })
  active_accounts?: AggregateValue[];

  @Field(() => ThresholdCountModel, { name: 'balance', nullable: true })
  balance?: ThresholdCountModel<AccountsHistoricalEntity>;

  @Field(() => ThresholdCountModel, { name: 'delegation_legacy_active', nullable: true })
  delegationLegacyActive?: ThresholdCountModel<AccountsHistoricalEntity>;

  @Field(() => ThresholdCountModel, { name: 'delegation', nullable: true })
  delegation?: ThresholdCountModel<AccountsHistoricalEntity>;

  @Field(() => ThresholdCountModel, { name: 'total_balance_with_stake', nullable: true })
  totalBalanceWithStake?: ThresholdCountModel<AccountsHistoricalEntity>;

  @Field(() => ThresholdCountModel, { name: 'total_stake', nullable: true })
  totalStake?: ThresholdCountModel<AccountsHistoricalEntity>;
}
