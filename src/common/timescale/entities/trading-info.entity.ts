import { Column, Entity, Generated, PrimaryColumn, Unique } from "typeorm";

@Entity('trading_info')
@Unique("UQ_ID", ["timestamp", "identifier", "firstToken", "secondToken"])
export class TradingInfoEntity {
  @Generated('increment')
  @PrimaryColumn({ type: 'bigint' })
  id: number = 0;

  @PrimaryColumn({ type: 'timestamp without time zone' })
  timestamp: Date = new Date();

  @Column({ nullable: false })
  identifier: string = '';

  @Column({ nullable: false })
  firstToken: string = '';

  @Column({ nullable: false })
  secondToken: string = '';

  @Column({ nullable: false, type: 'double precision' })
  price: number = 0;

  @Column({ nullable: false, type: 'double precision' })
  volume: number = 0;

  @Column({ nullable: false, type: 'double precision' })
  fee: number = 0;

  constructor(init?: Partial<TradingInfoEntity>) {
    Object.assign(this, init);
  }
}
