import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { PricesEntity } from "../entities/prices.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(PricesEntity)
export class PricesRepository extends GenericIngestRepository<PricesEntity> {
  constructor(
    @InjectRepository(PricesEntity)
    protected repository: Repository<PricesEntity>
  ) {
    super(repository);
  }
}
