import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { TrendsEntity } from "../entities/trends.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(TrendsEntity)
export class TrendsRepository extends GenericIngestRepository<TrendsEntity> {
  constructor(
    @InjectRepository(TrendsEntity)
    protected repository: Repository<TrendsEntity>
  ) {
    super(repository);
  }
}
