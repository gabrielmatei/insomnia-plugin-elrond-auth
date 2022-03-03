import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { AccountsDelegationEntity } from "../entities/accounts-delegation.entity";

@Injectable()
@EntityRepository(AccountsDelegationEntity)
export class AccountsDelegationRepository extends GenericIngestService<AccountsDelegationEntity> {
  constructor(
    @InjectRepository(AccountsDelegationEntity)
    protected repository: Repository<AccountsDelegationEntity>
  ) {
    super(repository);
  }
}
