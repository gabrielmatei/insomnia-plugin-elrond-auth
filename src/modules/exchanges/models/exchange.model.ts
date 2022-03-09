import { ObjectType, HideField, Field } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";

@ObjectType()
export class ExchangeModel {
  @HideField()
  series: string;

  @Field(() => [ScalarValue], { name: 'balance', nullable: true })
  balance?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'total', nullable: true })
  total?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'inflows', nullable: true })
  inflows?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'outflows', nullable: true })
  outflows?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'inflow_24h', nullable: true })
  inflow24h?: [ScalarValue];

  @Field(() => [ScalarValue], { name: 'outflow_24h', nullable: true })
  outflow24h?: [ScalarValue];

  constructor(series: string) {
    this.series = series;
  }
}
