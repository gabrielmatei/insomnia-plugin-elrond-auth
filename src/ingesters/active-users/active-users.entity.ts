import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('active_users')
export class ActiveUsersEntity extends GenericIngestEntity { }
