import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('exchanges')
export class ExchangesEntity extends GenericIngestEntity { }
