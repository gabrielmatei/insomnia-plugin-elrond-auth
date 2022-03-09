import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class GithubActivityModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], { name: 'commits', nullable: true })
  commits?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'commits_24h', nullable: true })
  commits_24h?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'contributors', nullable: true })
  contributors?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'stars', nullable: true })
  stars?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
