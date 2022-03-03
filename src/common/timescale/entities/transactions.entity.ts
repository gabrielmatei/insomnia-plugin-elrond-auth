import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('transactions')
export class TransactionsEntity extends GenericIngestEntity { }
