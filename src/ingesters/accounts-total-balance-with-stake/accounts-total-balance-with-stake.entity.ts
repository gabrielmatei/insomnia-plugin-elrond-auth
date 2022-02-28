import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_total_balance_with_stake')
export class AccountsTotalBalanceWithStake extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): AccountsTotalBalanceWithStake[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new AccountsTotalBalanceWithStake();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
