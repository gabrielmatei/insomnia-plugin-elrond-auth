import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('twitter')
export class TwitterEntity extends GenericIngestEntity { }
