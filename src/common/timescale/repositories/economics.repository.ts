import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { EconomicsEntity } from "../entities/economics.entity";

@Injectable()
@EntityRepository(EconomicsEntity)
export class EconomicsRepository extends GenericIngestService<EconomicsEntity> {
  constructor(
    @InjectRepository(EconomicsEntity)
    protected repository: Repository<EconomicsEntity>
  ) {
    super(repository);
  }
}
