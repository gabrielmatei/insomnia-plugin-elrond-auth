import { Field, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { AccountsHistoricalEntity } from "src/common/timescale/entities/accounts-historical.entity";
import { CountModel } from "src/modules/models/count.model";
import { ThresholdCountModel } from "./threshold-count.model";

@ObjectType()
export class AccountsModel extends CountModel {
  @Field(() => [ScalarValue], { name: 'active_accounts', nullable: true })
  active_accounts?: [ScalarValue];

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
