import { GenericIngestEntity } from "src/common/timescale/entities/generic-ingest.entity";
import { EntityTarget } from "typeorm";

export class IngestRecords {
  entity!: EntityTarget<GenericIngestEntity>;
  records!: GenericIngestEntity[];
}
