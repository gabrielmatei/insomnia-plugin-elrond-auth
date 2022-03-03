import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { StakingDetailedEntity } from "../entities/staking-detailed.entity";

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
