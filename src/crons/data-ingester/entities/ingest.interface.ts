import { IngestResponse } from "./ingest.response";

export interface Ingest {
  name: string;
  // entityTarget: EntityTarget<GenericIngestEntity>;
  fetch(): Promise<IngestResponse>
}
