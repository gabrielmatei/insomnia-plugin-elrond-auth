import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_delegation_legacy_active')
export class AccountsDelegationLegacyActive extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsDelegationLegacyActive[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsDelegationLegacyActive();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
