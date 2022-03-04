import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { TransactionsEntity } from "../entities/transactions.entity";

@Injectable()
@EntityRepository(TransactionsEntity)
export class TransactionsRepository extends GenericIngestService<TransactionsEntity> {
  constructor(
    @InjectRepository(TransactionsEntity)
    protected repository: Repository<TransactionsEntity>
  ) {
    super(repository);
  }
}
