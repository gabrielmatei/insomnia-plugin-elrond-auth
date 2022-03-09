import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { QuotesHistoricalEntity } from "../entities/quotes-historical.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(QuotesHistoricalEntity)
export class QuotesHistoricalRepository extends GenericIngestRepository<QuotesHistoricalEntity> {
  constructor(
    @InjectRepository(QuotesHistoricalEntity)
    protected repository: Repository<QuotesHistoricalEntity>
  ) {
    super(repository);
  }
}
