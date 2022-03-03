import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsDelegationLegacyActiveEntity } from "../entities/accounts-delegation-legacy-active.entity";

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
