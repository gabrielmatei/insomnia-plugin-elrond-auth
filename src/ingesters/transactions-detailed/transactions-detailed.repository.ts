import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { TransactionsDetailedEntity } from "./transactions-detailed.entity";

@Injectable()
@EntityRepository(TransactionsDetailedEntity)
export class TransactionsDetailedRepository extends GenericIngestService<TransactionsDetailedEntity> {
  constructor(
    @InjectRepository(TransactionsDetailedEntity)
    protected repository: Repository<TransactionsDetailedEntity>
  ) {
    super(repository);
  }
}
