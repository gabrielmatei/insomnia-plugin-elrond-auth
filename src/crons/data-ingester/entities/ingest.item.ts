import { CronExpression } from "@nestjs/schedule";
import { Ingest } from "./ingest.interface";

export class IngestItem {
  refreshInterval!: CronExpression;
  fetcher!: Ingest;
}
