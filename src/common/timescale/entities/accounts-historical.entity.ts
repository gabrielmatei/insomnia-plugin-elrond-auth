import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('accounts_historical')
export class AccountsHistoricalEntity extends GenericIngestEntity { }
