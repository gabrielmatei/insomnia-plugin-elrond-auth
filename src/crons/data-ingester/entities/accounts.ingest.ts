import { Ingest } from "./ingest";

export class AccountsIngest implements Ingest {
  public async fetch(): Promise<Record<string, number>> {
    return {
      'a': 0,
    };
  }
}
