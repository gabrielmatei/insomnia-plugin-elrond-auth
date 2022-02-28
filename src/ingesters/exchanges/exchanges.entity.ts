import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('exchanges')
export class Exchanges extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Exchanges[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Exchanges();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
