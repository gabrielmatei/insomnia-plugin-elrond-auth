import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { EconomicsEntity } from "../entities/economics.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(EconomicsEntity)
export class EconomicsRepository extends GenericIngestRepository<EconomicsEntity> {
  constructor(
    @InjectRepository(EconomicsEntity)
    protected repository: Repository<EconomicsEntity>
  ) {
    super(repository);
  }
}
