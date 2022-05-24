import { registerEnumType } from "@nestjs/graphql";

export enum QuotesCoinEnum {
  EGLD = "egld",
  BTC = "btc",
  ETH = "eth",
  BNB = "bnb",
  BUSD = "busd",
  USDC = "usdc",
}

registerEnumType(QuotesCoinEnum, { name: 'QuotesCoin' });
