import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Transactions } from "./transactions.entity";

@Injectable()
@EntityRepository(Transactions)
export class TransactionsRepository extends GenericIngestService<Transactions> {
  constructor(
    @InjectRepository(Transactions)
    protected repository: Repository<Transactions>
  ) {
    super(repository);
  }
}
