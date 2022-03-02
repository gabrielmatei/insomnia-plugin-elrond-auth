import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_count')
export class AccountsCountEntity extends GenericIngestEntity { }
