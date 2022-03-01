import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('prices')
export class PricesEntity extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): PricesEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new PricesEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
