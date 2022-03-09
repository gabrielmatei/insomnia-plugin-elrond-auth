import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { GenericIngestEntity } from "src/common/timescale/entities/generic-ingest.entity";
import { EntityTarget } from "typeorm";

@ObjectType()
export class ThresholdCountModel<T extends GenericIngestEntity> {
  @HideField()
  series: string;

  @HideField()
  entity: EntityTarget<T>;

  @Field(() => [ScalarValue], { name: 'count_gt_0', nullable: true })
  count_gt_0?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_0_1', nullable: true })
  count_gt_0_1?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_1', nullable: true })
  count_gt_1?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_10', nullable: true })
  count_gt_10?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_100', nullable: true })
  count_gt_100?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_1000', nullable: true })
  count_gt_1000?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_gt_10000', nullable: true })
  count_gt_10000?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'count_24h', nullable: true })
  count_24h?: [ScalarValue];

  constructor(series: string, entity: EntityTarget<T>) {
    this.series = series;
    this.entity = entity;
  }
}
