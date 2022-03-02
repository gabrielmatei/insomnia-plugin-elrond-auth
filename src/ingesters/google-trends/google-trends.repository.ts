import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { GoogleTrendsEntity } from "./google-trends.entity";

@Injectable()
@EntityRepository(GoogleTrendsEntity)
export class GoogleTrendsRepository extends GenericIngestService<GoogleTrendsEntity> {
  constructor(
    @InjectRepository(GoogleTrendsEntity)
    protected repository: Repository<GoogleTrendsEntity>
  ) {
    super(repository);
  }
}
