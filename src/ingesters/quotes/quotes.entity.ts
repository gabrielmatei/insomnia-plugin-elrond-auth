import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('quotes')
export class Quotes extends GenericIngestEntity {
  static fromObject(timestamp: Date, object: any): Quotes[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, any]) => Quotes.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Quotes[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Quotes();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
