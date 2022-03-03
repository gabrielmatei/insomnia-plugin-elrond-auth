import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { TransactionsDetailedEntity } from "../entities/transactions-detailed.entity";

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
