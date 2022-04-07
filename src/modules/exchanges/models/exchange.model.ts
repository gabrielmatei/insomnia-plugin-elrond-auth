import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";

@ObjectType()
export class ExchangeModel {
  @HideField()
  series: string;

  @Field(() => [AggregateValue], { name: 'balance', nullable: true })
  balance?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'total', nullable: true })
  total?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'inflows', nullable: true })
  inflows?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'outflows', nullable: true })
  outflows?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'inflow_24h', nullable: true })
  inflow24h?: AggregateValue[];

  @Field(() => [AggregateValue], { name: 'outflow_24h', nullable: true })
  outflow24h?: AggregateValue[];

  constructor(series: string) {
    this.series = series;
  }
}
