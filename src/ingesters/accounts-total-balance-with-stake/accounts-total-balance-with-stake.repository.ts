import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsTotalBalanceWithStakeEntity } from "./accounts-total-balance-with-stake.entity";

@Injectable()
@EntityRepository(AccountsTotalBalanceWithStakeEntity)
export class AccountsTotalBalanceWithStakeRepository extends GenericIngestService<AccountsTotalBalanceWithStakeEntity> {
  constructor(
    @InjectRepository(AccountsTotalBalanceWithStakeEntity)
    protected repository: Repository<AccountsTotalBalanceWithStakeEntity>
  ) {
    super(repository);
  }
}
