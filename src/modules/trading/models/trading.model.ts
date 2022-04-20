import { Field, ObjectType } from "@nestjs/graphql";
import { TradingInfoModel } from "./trading-info.model";

@ObjectType()
export class TradingModel {
  @Field(() => TradingInfoModel, { name: 'pair', nullable: true })
  pair?: TradingInfoModel;
}
