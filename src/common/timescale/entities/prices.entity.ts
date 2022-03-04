import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('prices')
export class PricesEntity extends GenericIngestEntity { }
