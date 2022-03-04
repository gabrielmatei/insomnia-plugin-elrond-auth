import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { StakingEntity } from "../entities/staking.entity";

@Injectable()
@EntityRepository(StakingEntity)
export class StakingRepository extends GenericIngestService<StakingEntity> {
  constructor(
    @InjectRepository(StakingEntity)
    protected repository: Repository<StakingEntity>
  ) {
    super(repository);
  }
}
