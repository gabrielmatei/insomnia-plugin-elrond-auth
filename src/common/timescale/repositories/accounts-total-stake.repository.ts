import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsTotalStakeEntity } from "../entities/accounts-total-stake.entity";

@Injectable()
@EntityRepository(AccountsTotalStakeEntity)
export class AccountsTotalStakeRepository extends GenericIngestService<AccountsTotalStakeEntity> {
  constructor(
    @InjectRepository(AccountsTotalStakeEntity)
    protected repository: Repository<AccountsTotalStakeEntity>
  ) {
    super(repository);
  }
}
