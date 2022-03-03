import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('economics')
export class EconomicsEntity extends GenericIngestEntity { }
