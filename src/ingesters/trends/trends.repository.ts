import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { TrendsEntity } from "./trends.entity";

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
