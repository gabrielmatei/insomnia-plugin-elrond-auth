import { Field, ObjectType } from "@nestjs/graphql";
import { TradeModel } from "./trade.model";

@ObjectType()
export class BlockModel {
  @Field(() => String, { nullable: true })
  hash: string = '';

  @Field(() => Number, { nullable: true })
  timestamp: number = 0;

  @Field(() => [TradeModel], { nullable: true })
  trades: TradeModel[] = [];
}
