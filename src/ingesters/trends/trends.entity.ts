import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('trends')
export class TrendsEntity extends GenericIngestEntity { }
