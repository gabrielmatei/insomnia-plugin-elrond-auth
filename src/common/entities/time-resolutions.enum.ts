import { registerEnumType } from "@nestjs/graphql";

export enum TimeResolutionsEnum {
  HOUR = "1 hour",
  DAY = "1 day",
}

registerEnumType(TimeResolutionsEnum, { name: 'TimeResolutions' });
