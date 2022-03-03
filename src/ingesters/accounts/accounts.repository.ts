import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsEntity } from "./accounts.entity";

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
