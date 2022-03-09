import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('transactions_historical')
export class TransactionsHistoricalEntity extends GenericIngestEntity { }
