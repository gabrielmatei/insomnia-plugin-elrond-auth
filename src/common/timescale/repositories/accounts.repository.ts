import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { AccountsEntity } from "../entities/accounts.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(AccountsEntity)
export class AccountsRepository extends GenericIngestRepository<AccountsEntity> {
  constructor(
    @InjectRepository(AccountsEntity)
    protected repository: Repository<AccountsEntity>
  ) {
    super(repository);
  }
}
