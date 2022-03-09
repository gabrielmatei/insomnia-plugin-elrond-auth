import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { QuotesEntity } from "../entities/quotes.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(QuotesEntity)
export class QuotesRepository extends GenericIngestRepository<QuotesEntity> {
  constructor(
    @InjectRepository(QuotesEntity)
    protected repository: Repository<QuotesEntity>
  ) {
    super(repository);
  }
}
