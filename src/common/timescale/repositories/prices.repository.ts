import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { PricesEntity } from "../entities/prices.entity";

@Injectable()
@EntityRepository(PricesEntity)
export class PricesRepository extends GenericIngestService<PricesEntity> {
  constructor(
    @InjectRepository(PricesEntity)
    protected repository: Repository<PricesEntity>
  ) {
    super(repository);
  }
}
