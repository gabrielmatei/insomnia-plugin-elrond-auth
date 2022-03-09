import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { TransactionsHistoricalBackupEntity } from "../entities/transactions-historical-backup.entity";
import { TransactionsHistoricalEntity } from "../entities/transactions-historical.entity";
import { TransactionsEntity } from "../entities/transactions.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(TransactionsEntity)
export class TransactionsRepository extends GenericIngestRepository<TransactionsEntity> {
  constructor(
    @InjectRepository(TransactionsEntity)
    protected repository: Repository<TransactionsEntity>
  ) {
    super(repository);
  }
}

@Injectable()
@EntityRepository(TransactionsHistoricalEntity)
export class TransactionsHistoricalRepository extends GenericIngestRepository<TransactionsHistoricalEntity> {
  constructor(
    @InjectRepository(TransactionsHistoricalEntity)
    protected repository: Repository<TransactionsHistoricalEntity>
  ) {
    super(repository);
  }
}

@Injectable()
@EntityRepository(TransactionsHistoricalBackupEntity)
export class TransactionsHistoricalBackupRepository extends GenericIngestRepository<TransactionsHistoricalBackupEntity> {
  constructor(
    @InjectRepository(TransactionsHistoricalBackupEntity)
    protected repository: Repository<TransactionsHistoricalBackupEntity>
  ) {
    super(repository);
  }
}
