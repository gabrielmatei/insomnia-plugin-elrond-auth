import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_delegation')
export class AccountsDelegation extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsDelegation[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsDelegation();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
