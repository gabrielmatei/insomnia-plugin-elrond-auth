import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsCountEntity } from "./accounts-count.entity";

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
