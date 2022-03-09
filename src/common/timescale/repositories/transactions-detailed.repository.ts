import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { TransactionsDetailedEntity } from "../entities/transactions-detailed.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(TransactionsDetailedEntity)
export class TransactionsDetailedRepository extends GenericIngestRepository<TransactionsDetailedEntity> {
  constructor(
    @InjectRepository(TransactionsDetailedEntity)
    protected repository: Repository<TransactionsDetailedEntity>
  ) {
    super(repository);
  }
}
