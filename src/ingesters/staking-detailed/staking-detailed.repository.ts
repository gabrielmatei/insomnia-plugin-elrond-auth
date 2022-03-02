import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { StakingDetailedEntity } from "./staking-detailed.entity";

@Injectable()
@EntityRepository(StakingDetailedEntity)
export class StakingDetailedRepository extends GenericIngestService<StakingDetailedEntity> {
  constructor(
    @InjectRepository(StakingDetailedEntity)
    protected repository: Repository<StakingDetailedEntity>
  ) {
    super(repository);
  }
}
