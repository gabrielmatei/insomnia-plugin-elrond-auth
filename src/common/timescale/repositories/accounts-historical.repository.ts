import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { AccountsHistoricalEntity } from "../entities/accounts-historical.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";
@Injectable()
@EntityRepository(AccountsHistoricalEntity)
export class AccountsHistoricalRepository extends GenericIngestRepository<AccountsHistoricalEntity> {
  constructor(
    @InjectRepository(AccountsHistoricalEntity)
    protected repository: Repository<AccountsHistoricalEntity>
  ) {
    super(repository);
  }
}
