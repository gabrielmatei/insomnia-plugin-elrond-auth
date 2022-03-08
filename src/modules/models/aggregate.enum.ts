import { registerEnumType } from "@nestjs/graphql";

export enum AggregateEnum {
  LAST = "LAST",
  MIN = "MIN",
  MAX = "MAX",
  COUNT = "COUNT",
  SUM = "SUM",
  AVG = "AVG",
}

registerEnumType(AggregateEnum, { name: 'Aggregate' });
