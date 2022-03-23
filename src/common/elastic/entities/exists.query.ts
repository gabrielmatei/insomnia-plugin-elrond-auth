import { AbstractQuery } from "./abstract.query";

export class ExistsQuery extends AbstractQuery {
  constructor(private readonly key: string) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQuery(): any {
    return { exists: { field: this.key } };
  }
}
