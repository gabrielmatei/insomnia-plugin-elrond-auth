import { registerEnumType } from "@nestjs/graphql";

export enum TimeRangeEnum {
  HOUR = "hours",
  DAY = "days",
  WEEK = "weeks",
  MONTH = "months",
  YEAR = "years",
}

registerEnumType(TimeRangeEnum, { name: 'TimeRange' });
