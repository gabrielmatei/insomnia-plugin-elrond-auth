import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { QuotesEntity } from "./quotes.entity";

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
