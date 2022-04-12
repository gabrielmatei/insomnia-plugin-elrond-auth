export class Pair {
  address: string = '';
  firstToken: EsdtToken;
  secondToken: EsdtToken;

  constructor(firstToken: EsdtToken, secondToken: EsdtToken) {
    this.firstToken = firstToken;
    this.secondToken = secondToken;
  }

  static getSymbol(pair: Pair) {
    return `${EsdtToken.getTicker(pair.firstToken)}${EsdtToken.getTicker(pair.secondToken)}`;
  }
}

export class EsdtToken {
  identifier: string = '';
  name: string = '';
  decimals: number = 0;

  static getTicker(token: EsdtToken) {
    return token.identifier.split('-')[0];
  }
}
