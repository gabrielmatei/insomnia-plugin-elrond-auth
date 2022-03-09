import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class KeywordModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], { name: 'clicks', nullable: true })
  clicks?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'impressions', nullable: true })
  impressions?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'ctr', nullable: true })
  ctr?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'position', nullable: true })
  position?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
