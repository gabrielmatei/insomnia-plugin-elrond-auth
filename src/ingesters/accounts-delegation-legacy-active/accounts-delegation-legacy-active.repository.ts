import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsDelegationLegacyActive } from "./accounts-delegation-legacy-active.entity";

@Injectable()
@EntityRepository(AccountsDelegationLegacyActive)
export class AccountsDelegationLegacyActiveRepository extends GenericIngestService<AccountsDelegationLegacyActive> {
  constructor(
    @InjectRepository(AccountsDelegationLegacyActive)
    protected repository: Repository<AccountsDelegationLegacyActive>
  ) {
    super(repository);
  }
}
