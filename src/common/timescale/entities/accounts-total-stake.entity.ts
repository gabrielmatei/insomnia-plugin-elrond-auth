import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('accounts_total_stake')
export class AccountsTotalStakeEntity extends GenericIngestEntity { }
