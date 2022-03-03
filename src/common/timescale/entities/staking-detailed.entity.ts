import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('staking_detailed')
export class StakingDetailedEntity extends GenericIngestEntity { }
