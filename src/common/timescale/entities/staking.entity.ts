import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('staking')
export class StakingEntity extends GenericIngestEntity { }
