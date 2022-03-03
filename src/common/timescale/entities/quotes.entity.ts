import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('quotes')
export class QuotesEntity extends GenericIngestEntity { }
