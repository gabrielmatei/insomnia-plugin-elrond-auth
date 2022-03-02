import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { TransactionsEntity } from "./transactions.entity";

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
