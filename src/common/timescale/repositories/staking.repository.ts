import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { StakingEntity } from "../entities/staking.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(StakingEntity)
export class StakingRepository extends GenericIngestRepository<StakingEntity> {
  constructor(
    @InjectRepository(StakingEntity)
    protected repository: Repository<StakingEntity>
  ) {
    super(repository);
  }
}
