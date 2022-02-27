import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('transactions')
export class Transactions extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Transactions[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Transactions();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
