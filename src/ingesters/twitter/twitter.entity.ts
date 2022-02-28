import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('twitter')
export class Twitter extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Twitter[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Twitter();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
