import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsBalanceEntity } from "./accounts-balance.entity";

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
