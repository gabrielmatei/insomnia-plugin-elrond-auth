import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('staking')
export class StakingEntity extends GenericIngestEntity { }
