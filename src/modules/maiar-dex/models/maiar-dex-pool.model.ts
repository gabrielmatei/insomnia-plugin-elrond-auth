import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class MaiarDexPoolModel {
  @HideField()
  series: string;

  @Field(() => String, { name: 'name', nullable: true })
  name: string;

  @Field(() => [ScalarValue], { name: 'volume', nullable: true })
  volume?: ScalarValue[];

  constructor(series: string) {
    this.series = series;
    this.name = series;
  }
}
