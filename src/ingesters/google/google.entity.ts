import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('google')
export class GoogleEntity extends GenericIngestEntity { }
