import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { StakingHistoricalEntity } from "../entities/staking-historical.entity";

@Injectable()
@EntityRepository(StakingHistoricalEntity)
export class StakingHistoricalRepository extends GenericIngestService<StakingHistoricalEntity> {
  constructor(
    @InjectRepository(StakingHistoricalEntity)
    protected repository: Repository<StakingHistoricalEntity>
  ) {
    super(repository);
  }
}
