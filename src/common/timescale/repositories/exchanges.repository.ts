import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { ExchangesEntity } from "../entities/exchanges.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(ExchangesEntity)
export class ExchangesRepository extends GenericIngestRepository<ExchangesEntity> {
  constructor(
    @InjectRepository(ExchangesEntity)
    protected repository: Repository<ExchangesEntity>
  ) {
    super(repository);
  }
}
