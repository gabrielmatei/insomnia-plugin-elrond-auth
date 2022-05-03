import { Field, ObjectType } from "@nestjs/graphql";
import { Block } from "src/common/rabbitmq/entities/block";
import { TradingInfoEntity } from "src/common/timescale/entities/trading-info.entity";
import { TradeModel } from "./trade.model";

@ObjectType()
export class BlockModel {
  @Field(() => String, { nullable: true })
  hash: string = '';

  @Field(() => Number, { nullable: true })
  timestamp: number = 0;

  @Field(() => [TradeModel], { nullable: true })
  trades: TradeModel[] = [];

  static fromTrades(block: Block, trades: TradingInfoEntity[]) {
    const newBlock = new BlockModel();
    newBlock.hash = block.hash;
    newBlock.timestamp = block.timestamp;
    newBlock.trades = trades.map(trade => TradeModel.fromEntity(trade));

    return newBlock;
  }
}
