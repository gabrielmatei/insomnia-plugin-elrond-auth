import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('staking_historical_backup')
export class StakingHistoricalBackupEntity extends GenericIngestEntity { }
