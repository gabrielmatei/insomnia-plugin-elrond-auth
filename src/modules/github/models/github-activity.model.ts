import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class GithubActivityModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'commits', nullable: true })
  commits?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'commits_24h', nullable: true })
  commits_24h?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'contributors', nullable: true })
  contributors?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'stars', nullable: true })
  stars?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
