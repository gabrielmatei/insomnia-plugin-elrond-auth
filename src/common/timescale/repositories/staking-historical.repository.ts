import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { StakingHistoricalEntity } from "../entities/staking-historical.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(StakingHistoricalEntity)
export class StakingHistoricalRepository extends GenericIngestRepository<StakingHistoricalEntity> {
  constructor(
    @InjectRepository(StakingHistoricalEntity)
    protected repository: Repository<StakingHistoricalEntity>
  ) {
    super(repository);
  }
}
