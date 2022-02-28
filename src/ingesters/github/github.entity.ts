import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('github')
export class Github extends GenericIngestEntity {
  static fromObject(timestamp: Date, object: any): Github[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, any]) => Github.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Github[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Github();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
