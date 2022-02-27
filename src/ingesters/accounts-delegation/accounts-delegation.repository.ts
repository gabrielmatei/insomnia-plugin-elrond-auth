import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsDelegation } from "./accounts-delegation.entity";

@Injectable()
@EntityRepository(AccountsDelegation)
export class AccountsDelegationRepository extends GenericIngestService<AccountsDelegation> {
  constructor(
    @InjectRepository(AccountsDelegation)
    protected repository: Repository<AccountsDelegation>
  ) {
    super(repository);
  }
}
