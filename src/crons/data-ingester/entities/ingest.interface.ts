import { IngestRecords } from "./ingest.records";

export interface Ingest {
  name: string;
  fetch(): Promise<IngestRecords[]>
}
