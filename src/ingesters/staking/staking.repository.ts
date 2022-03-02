import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { StakingEntity } from "./staking.entity";

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
