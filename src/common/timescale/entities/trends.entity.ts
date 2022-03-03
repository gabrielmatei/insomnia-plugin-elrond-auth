import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('trends')
export class TrendsEntity extends GenericIngestEntity { }
