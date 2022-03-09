import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { StakingHistoricalBackupEntity } from "../entities/staking-historical-backup.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(StakingHistoricalBackupEntity)
export class StakingHistoricalBackupRepository extends GenericIngestRepository<StakingHistoricalBackupEntity> {
  constructor(
    @InjectRepository(StakingHistoricalBackupEntity)
    protected repository: Repository<StakingHistoricalBackupEntity>
  ) {
    super(repository);
  }
}
