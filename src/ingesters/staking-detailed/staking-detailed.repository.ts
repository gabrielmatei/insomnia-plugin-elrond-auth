import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { StakingDetailed } from "./staking-detailed.entity";

@Injectable()
@EntityRepository(StakingDetailed)
export class StakingDetailedRepository extends GenericIngestService<StakingDetailed> {
  constructor(
    @InjectRepository(StakingDetailed)
    protected repository: Repository<StakingDetailed>
  ) {
    super(repository);
  }
}
