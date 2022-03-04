import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { QuotesEntity } from "../entities/quotes.entity";

@Injectable()
@EntityRepository(QuotesEntity)
export class QuotesRepository extends GenericIngestService<QuotesEntity> {
  constructor(
    @InjectRepository(QuotesEntity)
    protected repository: Repository<QuotesEntity>
  ) {
    super(repository);
  }
}
