import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { ExchangesDetailedEntity } from "./exchanges-detailed.entity";

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
