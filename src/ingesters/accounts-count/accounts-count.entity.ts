import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_count')
export class AccountsCount extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsCount[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsCount();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
