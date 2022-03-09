import { IngestRecords } from "./ingest.records";

export class IngestResponse {
  current?: IngestRecords;
  historical?: IngestRecords;
  backup?: IngestRecords;
}
