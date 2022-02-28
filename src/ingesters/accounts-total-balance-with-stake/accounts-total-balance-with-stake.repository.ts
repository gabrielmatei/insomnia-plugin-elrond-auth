import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsTotalBalanceWithStake } from "./accounts-total-balance-with-stake.entity";

@Injectable()
@EntityRepository(AccountsTotalBalanceWithStake)
export class AccountsTotalBalanceWithStakeRepository extends GenericIngestService<AccountsTotalBalanceWithStake> {
  constructor(
    @InjectRepository(AccountsTotalBalanceWithStake)
    protected repository: Repository<AccountsTotalBalanceWithStake>
  ) {
    super(repository);
  }
}
