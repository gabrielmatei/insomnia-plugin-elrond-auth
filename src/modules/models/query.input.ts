import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import { TimeRangeEnum } from "src/common/entities/time-range.enum";
import { TimeResolutionsEnum } from "src/common/entities/time-resolutions.enum";
import { AggregateEnum } from "./aggregate.enum";

@InputType()
export class QueryInput {
  @Field(() => AggregateEnum)
  aggregate!: AggregateEnum;

  @Field(() => TimeResolutionsEnum, { nullable: true })
  resolution?: TimeResolutionsEnum;

  @Field(() => TimeRangeEnum, { nullable: true })
  range?: TimeRangeEnum;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;
}
