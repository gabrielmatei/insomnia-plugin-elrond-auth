import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('exchanges_historical')
export class ExchangesHistoricalEntity extends GenericIngestEntity { }
