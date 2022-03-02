import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('google_trends')
export class GoogleTrendsEntity extends GenericIngestEntity { }
