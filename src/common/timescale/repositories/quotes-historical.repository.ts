import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { QuotesHistoricalEntity } from "../entities/quotes-historical.entity";

@Injectable()
@EntityRepository(QuotesHistoricalEntity)
export class QuotesHistoricalRepository extends GenericIngestService<QuotesHistoricalEntity> {
  constructor(
    @InjectRepository(QuotesHistoricalEntity)
    protected repository: Repository<QuotesHistoricalEntity>
  ) {
    super(repository);
  }
}
