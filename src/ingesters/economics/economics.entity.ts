import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('economics')
export class EconomicsEntity extends GenericIngestEntity { }
