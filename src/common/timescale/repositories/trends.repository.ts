import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { TrendsEntity } from "../entities/trends.entity";

@Injectable()
@EntityRepository(TrendsEntity)
export class TrendsRepository extends GenericIngestService<TrendsEntity> {
  constructor(
    @InjectRepository(TrendsEntity)
    protected repository: Repository<TrendsEntity>
  ) {
    super(repository);
  }
}
