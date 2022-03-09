import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('transactions_historical_backup')
export class TransactionsHistoricalBackupEntity extends GenericIngestEntity { }
