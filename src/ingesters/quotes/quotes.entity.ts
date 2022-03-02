import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('quotes')
export class QuotesEntity extends GenericIngestEntity { }
