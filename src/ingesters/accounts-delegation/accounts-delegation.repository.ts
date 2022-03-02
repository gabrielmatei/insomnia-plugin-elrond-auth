import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { AccountsDelegationEntity } from "./accounts-delegation.entity";

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
