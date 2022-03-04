import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('staking_historical')
export class StakingHistoricalEntity extends GenericIngestEntity { }
