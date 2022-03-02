import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { EntityTarget } from "typeorm";

export interface Ingest {
  name: string;
  entityTarget: EntityTarget<unknown>;
  fetch(): Promise<GenericIngestEntity[]>
}
