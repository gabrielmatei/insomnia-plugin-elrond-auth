import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { ExchangesHistoricalEntity } from "../entities/exchanges-historical.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(ExchangesHistoricalEntity)
export class ExchangesHistoricalRepository extends GenericIngestRepository<ExchangesHistoricalEntity> {
  constructor(
    @InjectRepository(ExchangesHistoricalEntity)
    protected repository: Repository<ExchangesHistoricalEntity>
  ) {
    super(repository);
  }
}
