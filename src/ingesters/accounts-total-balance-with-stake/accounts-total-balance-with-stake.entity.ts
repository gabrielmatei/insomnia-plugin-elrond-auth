import { Entity } from "typeorm";
import { GenericIngestEntity } from "../generic/generic-ingest.entity";

@Entity('accounts_total_balance_with_stake')
export class AccountsTotalBalanceWithStakeEntity extends GenericIngestEntity { }
