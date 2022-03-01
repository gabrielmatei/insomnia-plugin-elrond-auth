import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('transactions_detailed')
export class TransactionsDetailedEntity extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): TransactionsDetailedEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new TransactionsDetailedEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
