import { registerEnumType } from "@nestjs/graphql";

export enum TimeResolutions {
  HOUR = "1 hour",
  DAY = "1 day",
}

registerEnumType(TimeResolutions, { name: 'TimeResolutions' });
