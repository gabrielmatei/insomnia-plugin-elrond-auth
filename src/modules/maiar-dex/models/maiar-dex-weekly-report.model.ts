import { Field, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class MaiarDexWeeklyReportModel {
  @Field(() => String, { name: 'time_interval', nullable: true })
  time_interval?: string;

  @Field(() => Number, { name: 'total_value_locked', nullable: true })
  total_value_locked?: number;

  @Field(() => [AggregateValue], { name: 'total_volume', nullable: true })
  total_volume?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'mex_burnt', nullable: true, description: 'fees + penalities' })
  mex_burnt?: AggregateValue[];
}
