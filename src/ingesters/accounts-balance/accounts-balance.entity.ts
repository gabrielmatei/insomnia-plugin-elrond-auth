import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_balance')
export class AccountsBalance extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsBalance[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsBalance();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
