import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsCountEntity } from "../entities/accounts-count.entity";

@Injectable()
@EntityRepository(AccountsCountEntity)
export class AccountsCountRepository extends GenericIngestService<AccountsCountEntity> {
  constructor(
    @InjectRepository(AccountsCountEntity)
    protected repository: Repository<AccountsCountEntity>
  ) {
    super(repository);
  }
}
