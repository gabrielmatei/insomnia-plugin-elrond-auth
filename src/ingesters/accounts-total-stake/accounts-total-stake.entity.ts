import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_total_stake')
export class AccountsTotalStake extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsTotalStake[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsTotalStake();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
