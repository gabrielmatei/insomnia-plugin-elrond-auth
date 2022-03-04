import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('github')
export class GithubEntity extends GenericIngestEntity { }
