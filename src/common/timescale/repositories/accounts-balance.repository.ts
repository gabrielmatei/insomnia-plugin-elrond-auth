import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsBalanceEntity } from "../entities/accounts-balance.entity";
@Injectable()
@EntityRepository(AccountsBalanceEntity)
export class AccountsBalanceRepository extends GenericIngestService<AccountsBalanceEntity> {
  constructor(
    @InjectRepository(AccountsBalanceEntity)
    protected repository: Repository<AccountsBalanceEntity>
  ) {
    super(repository);
  }
}
