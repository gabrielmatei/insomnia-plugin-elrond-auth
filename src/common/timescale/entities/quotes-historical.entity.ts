import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('quotes_historical')
export class QuotesHistoricalEntity extends GenericIngestEntity { }
