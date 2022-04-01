import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('maiar_dex')
export class MaiarDexEntity extends GenericIngestEntity { }
