import { registerEnumType } from "@nestjs/graphql";

export enum AggregateEnum {
  FIRST = "first",
  LAST = "last",
  MIN = "min",
  MAX = "max",
  COUNT = "count",
  SUM = "sum",
  AVG = "avg",
}

registerEnumType(AggregateEnum, { name: 'Aggregate' });
