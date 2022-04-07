import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { GenericIngestEntity } from "src/common/timescale/entities/generic-ingest.entity";
import { EntityTarget } from "typeorm";

@ObjectType()
export class ThresholdCountModel<T extends GenericIngestEntity> {
  @HideField()
  series: string;

  @HideField()
  entity: EntityTarget<T>;

  @Field(() => [AggregateValue], { name: 'count_gt_0', nullable: true })
  count_gt_0?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_0_1', nullable: true })
  count_gt_0_1?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_1', nullable: true })
  count_gt_1?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_10', nullable: true })
  count_gt_10?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_100', nullable: true })
  count_gt_100?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_1000', nullable: true })
  count_gt_1000?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_gt_10000', nullable: true })
  count_gt_10000?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'count_24h', nullable: true })
  count_24h?: AggregateValue[];

  constructor(series: string, entity: EntityTarget<T>) {
    this.series = series;
    this.entity = entity;
  }
}
