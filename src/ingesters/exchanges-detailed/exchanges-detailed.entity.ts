import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('exchanges_detailed')
export class ExchangesDetailedEntity extends GenericIngestEntity { }
