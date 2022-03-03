import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('google')
export class GoogleEntity extends GenericIngestEntity { }
