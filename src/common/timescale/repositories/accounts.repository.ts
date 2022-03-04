import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsEntity } from "../entities/accounts.entity";

@Injectable()
@EntityRepository(AccountsEntity)
export class AccountsRepository extends GenericIngestService<AccountsEntity> {
  constructor(
    @InjectRepository(AccountsEntity)
    protected repository: Repository<AccountsEntity>
  ) {
    super(repository);
  }
}
