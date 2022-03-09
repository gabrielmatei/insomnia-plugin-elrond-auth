import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import { TimeRangeEnum } from "src/common/entities/time-range.enum";
import { TimeResolutionsEnum } from "src/common/entities/time-resolutions.enum";
import { AggregateEnum } from "./aggregate.enum";

@InputType()
export class QueryInput {
  @Field(() => AggregateEnum, { name: 'aggregate', nullable: false })
  aggregate!: AggregateEnum;

  @Field(() => TimeResolutionsEnum, { name: 'resolution', nullable: true })
  resolution?: TimeResolutionsEnum;

  @Field(() => TimeRangeEnum, { name: 'range', nullable: true })
  range?: TimeRangeEnum;

  @Field(() => GraphQLISODateTime, { name: 'start_date', nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { name: 'end_date', nullable: true })
  endDate?: Date;
}
