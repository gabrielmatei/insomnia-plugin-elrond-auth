import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsTotalStakeEntity } from "./accounts-total-stake.entity";

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
