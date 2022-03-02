import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_delegation_legacy_active')
export class AccountsDelegationLegacyActiveEntity extends GenericIngestEntity { }
