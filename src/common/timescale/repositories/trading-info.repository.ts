import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { TradingInfoEntity } from "../entities/trading-info.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(TradingInfoEntity)
export class TradingInfoRepository extends GenericIngestRepository<TradingInfoEntity> {
  constructor(
    @InjectRepository(TradingInfoEntity)
    protected repository: Repository<TradingInfoEntity>
  ) {
    super(repository);
  }
}
