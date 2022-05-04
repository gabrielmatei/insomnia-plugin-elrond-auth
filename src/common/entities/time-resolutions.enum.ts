import { registerEnumType } from "@nestjs/graphql";

export enum TimeResolutionsEnum {
  INTERVAL_1_MINUTE = "1 minute",
  INTERVAL_10_MINUTES = "10 minutes",
  HOUR = "1 hour",
  DAY = "1 day",
}

registerEnumType(TimeResolutionsEnum, { name: 'TimeResolutions' });
