import BigNumber from "bignumber.js";

export type GenericTokenType = {
  tokenID: string;
  nonce: number;
  amount: string;
};

export class GenericToken {
  tokenID: string = '';
  nonce: BigNumber = new BigNumber(0);
  amount: BigNumber = new BigNumber(0);

  constructor(init?: Partial<GenericToken>) {
    Object.assign(this, init);
  }

  toJSON() {
    return {
      tokenID: this.tokenID,
      nonce: this.nonce.toNumber(),
      amount: this.amount.toFixed(),
    };
  }
}
