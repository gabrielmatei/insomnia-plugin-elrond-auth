import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsHistoricalEntity } from "../entities/accounts-historical.entity";
@Injectable()
@EntityRepository(AccountsHistoricalEntity)
export class AccountsHistoricalRepository extends GenericIngestService<AccountsHistoricalEntity> {
  constructor(
    @InjectRepository(AccountsHistoricalEntity)
    protected repository: Repository<AccountsHistoricalEntity>
  ) {
    super(repository);
  }
}
