import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('exchanges')
export class ExchangesEntity extends GenericIngestEntity { }
