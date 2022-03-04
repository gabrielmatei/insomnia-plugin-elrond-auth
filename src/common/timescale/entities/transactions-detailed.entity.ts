import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('transactions_detailed')
export class TransactionsDetailedEntity extends GenericIngestEntity { }
