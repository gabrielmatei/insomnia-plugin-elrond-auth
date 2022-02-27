import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsCount } from "./accounts-count.entity";

@Injectable()
@EntityRepository(AccountsCount)
export class AccountsCountRepository extends GenericIngestService<AccountsCount> {
  constructor(
    @InjectRepository(AccountsCount)
    protected repository: Repository<AccountsCount>
  ) {
    super(repository);
  }
}
