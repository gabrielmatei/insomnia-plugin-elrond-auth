import { Field, ObjectType } from "@nestjs/graphql";
import { MaiarDexPoolSimpleModel } from "./maiar-dex-pool-simple.model";

@ObjectType()
export class MaiarDexWeeklyReportModel {
  @Field(() => String, { name: 'time_interval', nullable: true })
  time_interval?: string;

  @Field(() => Number, { name: 'total_value_locked', nullable: true })
  total_value_locked?: number;

  @Field(() => Number, { name: 'total_volume', nullable: true })
  total_volume?: number;

  @Field(() => Number, { name: 'mex_burnt', nullable: true, description: 'fees + penalities' })
  mex_burnt?: number;

  @Field(() => [MaiarDexPoolSimpleModel], { name: 'volume_pools', nullable: true })
  volume_pools?: MaiarDexPoolSimpleModel[];

  constructor(init?: Partial<MaiarDexWeeklyReportModel>) {
    Object.assign(this, init);
  }
}
