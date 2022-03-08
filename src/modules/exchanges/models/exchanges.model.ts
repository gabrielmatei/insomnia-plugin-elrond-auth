import { Field, ObjectType } from "@nestjs/graphql";
import { ExchangeModel } from "./exchange.model";

@ObjectType()
export class ExchangesModel {
  @Field(() => ExchangeModel, { name: 'total', nullable: true })
  total?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'binance_com', nullable: true })
  binanceCom?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'binance_us', nullable: true })
  binanceUs?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'bitfinex', nullable: true })
  bitfinex?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'bithumb', nullable: true })
  bithumb?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'bitmax', nullable: true })
  bitmax?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'crypto_com', nullable: true })
  cryptoCom?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'kucoin', nullable: true })
  kucoin?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'liquid', nullable: true })
  liquid?: ExchangeModel;

  @Field(() => ExchangeModel, { name: 'okex', nullable: true })
  okex?: ExchangeModel;
}
