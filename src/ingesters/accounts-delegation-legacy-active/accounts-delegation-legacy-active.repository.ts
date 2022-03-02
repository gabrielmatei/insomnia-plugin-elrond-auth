import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsDelegationLegacyActiveEntity } from "./accounts-delegation-legacy-active.entity";

@Injectable()
@EntityRepository(AccountsDelegationLegacyActiveEntity)
export class AccountsDelegationLegacyActiveRepository extends GenericIngestService<AccountsDelegationLegacyActiveEntity> {
  constructor(
    @InjectRepository(AccountsDelegationLegacyActiveEntity)
    protected repository: Repository<AccountsDelegationLegacyActiveEntity>
  ) {
    super(repository);
  }
}
