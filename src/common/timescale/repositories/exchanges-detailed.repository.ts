import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { ExchangesDetailedEntity } from "../entities/exchanges-detailed.entity";

@Injectable()
@EntityRepository(ExchangesDetailedEntity)
export class ExchangesDetailedRepository extends GenericIngestService<ExchangesDetailedEntity> {
  constructor(
    @InjectRepository(ExchangesDetailedEntity)
    protected repository: Repository<ExchangesDetailedEntity>
  ) {
    super(repository);
  }
}
