import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('twitter')
export class TwitterEntity extends GenericIngestEntity { }
