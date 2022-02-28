import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('google_trends')
export class GoogleTrends extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): GoogleTrends[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new GoogleTrends();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
