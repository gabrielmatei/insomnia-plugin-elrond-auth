import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { GoogleTrends } from "./google-trends.entity";

@Injectable()
@EntityRepository(GoogleTrends)
export class GoogleTrendsRepository extends GenericIngestService<GoogleTrends> {
  constructor(
    @InjectRepository(GoogleTrends)
    protected repository: Repository<GoogleTrends>
  ) {
    super(repository);
  }
}
