import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class MaiarDexPoolModel {
  @HideField()
  series: string;

  @Field(() => String, { name: 'name', nullable: true })
  name: string;

  @Field(() => [AggregateValue], { name: 'volume', nullable: true })
  volume?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
    this.name = series;
  }
}
