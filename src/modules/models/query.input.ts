import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import { TimeRangeEnum } from "src/common/entities/time-range.enum";
import { TimeResolutionsEnum } from "src/common/entities/time-resolutions.enum";

@InputType()
export class QueryInput {
  @Field(() => TimeResolutionsEnum, { name: 'resolution', nullable: true })
  resolution?: TimeResolutionsEnum;

  @Field(() => TimeRangeEnum, { name: 'range', nullable: true })
  range?: TimeRangeEnum;

  @Field(() => GraphQLISODateTime, { name: 'start_date', nullable: true })
  start_date?: Date;

  @Field(() => GraphQLISODateTime, { name: 'end_date', nullable: true })
  end_date?: Date;
}
