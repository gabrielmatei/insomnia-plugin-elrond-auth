import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Staking } from "./staking.entity";

@Injectable()
@EntityRepository(Staking)
export class StakingRepository extends GenericIngestService<Staking> {
  constructor(
    @InjectRepository(Staking)
    protected repository: Repository<Staking>
  ) {
    super(repository);
  }
}
