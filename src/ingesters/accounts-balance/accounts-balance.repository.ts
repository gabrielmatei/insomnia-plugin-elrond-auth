import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsBalance } from "./accounts-balance.entity";

@Injectable()
@EntityRepository(AccountsBalance)
export class AccountsBalanceRepository extends GenericIngestService<AccountsBalance> {
  constructor(
    @InjectRepository(AccountsBalance)
    protected repository: Repository<AccountsBalance>
  ) {
    super(repository);
  }
}
