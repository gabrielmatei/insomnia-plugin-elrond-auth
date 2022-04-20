import { BadRequestException } from "@nestjs/common";
import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import moment from "moment";
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

  static getStartDate(query: QueryInput): Date {
    let startDate = query.start_date;
    if (query.range) {
      startDate = moment.utc().subtract(1, query.range).toDate();
    } else if (!startDate) {
      throw new BadRequestException(`'start_date' or 'range' is required`);
    }
    return startDate;
  }
}
