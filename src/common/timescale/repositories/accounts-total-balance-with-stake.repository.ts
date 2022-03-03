import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsTotalBalanceWithStakeEntity } from "../entities/accounts-total-balance-with-stake.entity";

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
