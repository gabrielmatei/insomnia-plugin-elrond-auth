import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('economics')
export class Economics extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Economics[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Economics();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
