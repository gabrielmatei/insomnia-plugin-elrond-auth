import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('github-activity')
export class GithubActivityEntity extends GenericIngestEntity { }
