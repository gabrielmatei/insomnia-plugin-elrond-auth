import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsTotalStake } from "./accounts-total-stake.entity";

@Injectable()
@EntityRepository(AccountsTotalStake)
export class AccountsTotalStakeRepository extends GenericIngestService<AccountsTotalStake> {
  constructor(
    @InjectRepository(AccountsTotalStake)
    protected repository: Repository<AccountsTotalStake>
  ) {
    super(repository);
  }
}
