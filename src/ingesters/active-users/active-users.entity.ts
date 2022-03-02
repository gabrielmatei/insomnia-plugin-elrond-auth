import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('active_users')
export class ActiveUsersEntity extends GenericIngestEntity {
  static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): ActiveUsersEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new ActiveUsersEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
