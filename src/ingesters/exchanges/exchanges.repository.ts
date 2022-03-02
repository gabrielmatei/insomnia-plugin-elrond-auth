import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { ExchangesEntity } from "./exchanges.entity";

@Injectable()
@EntityRepository(ExchangesEntity)
export class ExchangesRepository extends GenericIngestService<ExchangesEntity> {
  constructor(
    @InjectRepository(ExchangesEntity)
    protected repository: Repository<ExchangesEntity>
  ) {
    super(repository);
  }
}
