import BigNumber from "bignumber.js";
import { Pair } from "./pair";
import { TimestreamQuery } from "aws-sdk";

export class Pool {
  pair!: Pair;
  volume!: number;

  static fromRow(pairs: Pair[], row: TimestreamQuery.Row): Pool | undefined {
    const pair = pairs.find(p => p.address === row?.Data[0]?.ScalarValue);
    if (!pair) {
      return undefined;
    }

    const volume = new BigNumber(row?.Data[1]?.ScalarValue ?? '0').toNumber();

    return { pair, volume };
  }
}
