import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { MaiarDexWeeklyReportModel } from "./maiar-dex-weekly-report.model";

@ObjectType()
export class MaiarDexModel {
  @Field(() => MaiarDexWeeklyReportModel, { name: 'weekly_report', nullable: true })
  weekly_report?: MaiarDexWeeklyReportModel;

  @Field(() => [AggregateValue], { name: 'total_value_locked', nullable: true })
  total_value_locked?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'total_volume', nullable: true })
  total_volume?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'mex_burnt', nullable: true })
  mex_burnt?: AggregateValue[];
}
