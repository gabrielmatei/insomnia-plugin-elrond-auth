import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Quotes } from "./quotes.entity";

@Injectable()
@EntityRepository(Quotes)
export class QuotesRepository extends GenericIngestService<Quotes> {
  constructor(
    @InjectRepository(Quotes)
    protected repository: Repository<Quotes>
  ) {
    super(repository);
  }
}
