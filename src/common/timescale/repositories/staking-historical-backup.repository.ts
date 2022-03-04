import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { StakingHistoricalBackupEntity } from "../entities/staking-historical-backup.entity";

@Injectable()
@EntityRepository(StakingHistoricalBackupEntity)
export class StakingHistoricalBackupRepository extends GenericIngestService<StakingHistoricalBackupEntity> {
  constructor(
    @InjectRepository(StakingHistoricalBackupEntity)
    protected repository: Repository<StakingHistoricalBackupEntity>
  ) {
    super(repository);
  }
}
