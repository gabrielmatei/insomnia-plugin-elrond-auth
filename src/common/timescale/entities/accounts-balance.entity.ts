import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('accounts_balance')
export class AccountsBalanceEntity extends GenericIngestEntity { }
