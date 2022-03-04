import { Column, Generated, PrimaryColumn } from "typeorm";

export class GenericIngestEntity {
  @Generated('increment')
  @Column()
  @PrimaryColumn()
  id: number = 0;

  @Column({
    nullable: false,
    type: 'timestamp without time zone',
  })
  @PrimaryColumn()
  timestamp: Date = new Date();

  @Column({
    nullable: true,
  })
  series?: string;

  @Column({
    nullable: false,
  })
  key: string = '';

  @Column({
    nullable: false,
    type: 'double precision',
  })
  value: number = 0;

  static fromObject(timestamp: Date, object: Record<string, Record<string, number>>): GenericIngestEntity[] {
    const entities = Object
      .entries(object)
      .map(([series, record]: [string, Record<string, number>]) => GenericIngestEntity.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  private static fromRecord(timestamp: Date, record: Record<string, number>, series?: string): GenericIngestEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new GenericIngestEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
