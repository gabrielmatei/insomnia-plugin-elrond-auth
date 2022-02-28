import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('staking_detailed')
export class StakingDetailed extends GenericIngestEntity {
  static fromObject(timestamp: Date, object: any): StakingDetailed[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, any]) => StakingDetailed.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): StakingDetailed[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new StakingDetailed();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
