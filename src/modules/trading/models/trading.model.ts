import { Field, ObjectType } from "@nestjs/graphql";
import { TradeModel } from "./trade.model";
import { TradingCandlestickModel } from "./trading-candlestick.model";
import { TradingInfoModel } from "./trading-info.model";

@ObjectType()
export class TradingModel {
  @Field(() => TradingInfoModel, { name: 'pair', nullable: true })
  pair?: TradingInfoModel;

  @Field(() => [TradingCandlestickModel], {
    name: 'candlestick',
    description: `
    - from, to, resolution -> history bars
    - to, resolution -> next available bar`,
    nullable: true,
  })
  candlestick?: [TradingCandlestickModel];

  @Field(() => TradeModel, { name: 'last_trade', nullable: true })
  last_trade?: TradeModel;
}
