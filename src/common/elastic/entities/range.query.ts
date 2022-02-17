import { AbstractQuery } from "./abstract.query";
export class RangeQuery extends AbstractQuery {
  private readonly key: string;
  private readonly lt: number | undefined;
  private readonly lte: number | undefined;
  private readonly gt: number | undefined;
  private readonly gte: number | undefined;

  constructor(key: string, options: { lt?: number, lte?: number, gt?: number, gte?: number }) {
    super();
    this.key = key;
    this.lt = options.lt;
    this.lte = options.lte;
    this.gt = options.gt;
    this.gte = options.gte;
  }

  getQuery(): any {
    return {
      range: {
        [this.key]: {
          lt: this.lt,
          lte: this.lte,
          gt: this.gt,
          gte: this.gte,
        },
      },
    };
  }
}
