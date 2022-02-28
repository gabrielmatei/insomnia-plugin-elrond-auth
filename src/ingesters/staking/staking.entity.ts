import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('staking')
export class Staking extends GenericIngestEntity {
  static fromObject(timestamp: Date, object: any): Staking[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, any]) => Staking.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): Staking[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new Staking();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
