import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { ExchangesEntity } from "../entities/exchanges.entity";

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
