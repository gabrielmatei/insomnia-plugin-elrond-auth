import { AbstractQuery } from "./abstract.query";

export class RangeQueryOptions {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
}

export class RangeQuery extends AbstractQuery {
  private readonly key: string;
  private readonly options: RangeQueryOptions;

  constructor(key: string, options: RangeQueryOptions) {
    super();
    this.key = key;
    this.options = options;
  }

  getQuery(): any {
    return {
      range: {
        [this.key]: {
          ...this.options,
        },
      },
    };
  }
}
