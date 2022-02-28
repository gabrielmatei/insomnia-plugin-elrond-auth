import { Column, Generated, PrimaryColumn } from "typeorm";

export abstract class GenericIngestEntity {
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
}
