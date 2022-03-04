import { Entity } from "typeorm";
import { GenericIngestEntity } from "./generic-ingest.entity";

@Entity('github-activity')
export class GithubActivityEntity extends GenericIngestEntity { }
