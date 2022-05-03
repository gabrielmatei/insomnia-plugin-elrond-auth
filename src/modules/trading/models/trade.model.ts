import { ObjectType, Field } from "@nestjs/graphql";
import moment from "moment";
import { TradingInfoEntity } from "src/common/timescale/entities/trading-info.entity";

@ObjectType()
export class TradeModel {
  @Field(() => Number, { nullable: true })
  timestamp: number = 0;

  @Field(() => String, { nullable: true })
  firstToken: string = '';

  @Field(() => String, { nullable: true })
  secondToken: string = '';

  @Field(() => Number, { nullable: true })
  price: number = 0;

  @Field(() => Number, { nullable: true })
  volume: number = 0;

  static fromEntity(entity: TradingInfoEntity) {
    const model = new TradeModel();
    model.timestamp = moment.utc(entity.timestamp).unix();
    model.firstToken = entity.firstToken;
    model.secondToken = entity.secondToken;
    model.price = entity.price;
    model.volume = entity.volume;

    return model;
  }
}
