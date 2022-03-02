import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('exchanges_detailed')
export class ExchangesDetailedEntity extends GenericIngestEntity {
  static fromObject(timestamp: Date, object: any): ExchangesDetailedEntity[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, any]) => ExchangesDetailedEntity.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): ExchangesDetailedEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new ExchangesDetailedEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
