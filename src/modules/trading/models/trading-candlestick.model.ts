import { Field, ObjectType } from "@nestjs/graphql";
import moment from "moment";

@ObjectType()
export class TradingCandlestickModel {
  @Field(() => Number, { name: 'timestamp', nullable: true })
  timestamp?: number;

  @Field(() => Number, { name: 'open_price', nullable: true })
  openPrice?: number = 0;

  @Field(() => Number, { name: 'high_price', nullable: true })
  highPrice?: number = 0;

  @Field(() => Number, { name: 'low_price', nullable: true })
  lowPrice?: number = 0;

  @Field(() => Number, { name: 'close_price', nullable: true })
  closePrice?: number = 0;

  @Field(() => Number, { name: 'volume', nullable: true })
  volume?: number = 0;

  @Field(() => Number, { name: 'count', nullable: true })
  count: number = 0;

  static fromRow(row: any) {
    const historyBar = new TradingCandlestickModel();
    historyBar.timestamp = moment.utc(row.time).unix();
    historyBar.lowPrice = row.low;
    historyBar.highPrice = row.high;
    historyBar.openPrice = row.open;
    historyBar.closePrice = row.close;
    historyBar.volume = row.volume;
    historyBar.count = parseInt(row.count);

    return historyBar;
  }
}
