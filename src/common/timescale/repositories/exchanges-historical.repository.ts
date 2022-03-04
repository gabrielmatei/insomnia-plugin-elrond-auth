import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { ExchangesHistoricalEntity } from "../entities/exchanges-historical.entity";

@Injectable()
@EntityRepository(ExchangesHistoricalEntity)
export class ExchangesHistoricalRepository extends GenericIngestService<ExchangesHistoricalEntity> {
  constructor(
    @InjectRepository(ExchangesHistoricalEntity)
    protected repository: Repository<ExchangesHistoricalEntity>
  ) {
    super(repository);
  }
}
