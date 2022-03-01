import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { PricesEntity } from "./prices.entity";

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
