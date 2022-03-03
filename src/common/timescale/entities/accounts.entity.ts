import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('accounts')
export class AccountsEntity extends GenericIngestEntity { }
