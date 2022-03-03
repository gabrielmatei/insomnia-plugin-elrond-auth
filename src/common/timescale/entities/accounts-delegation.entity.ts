import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('accounts_delegation')
export class AccountsDelegationEntity extends GenericIngestEntity { }
