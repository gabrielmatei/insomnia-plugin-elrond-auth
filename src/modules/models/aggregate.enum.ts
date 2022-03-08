import { registerEnumType } from "@nestjs/graphql";

export enum AggregateEnum {
  FIRST = "FIRST",
  LAST = "LAST",
  MIN = "MIN",
  MAX = "MAX",
  COUNT = "COUNT",
  SUM = "SUM",
  AVG = "AVG",
}

registerEnumType(AggregateEnum, { name: 'Aggregate' });
