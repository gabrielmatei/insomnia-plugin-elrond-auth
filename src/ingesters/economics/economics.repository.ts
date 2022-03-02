import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { EconomicsEntity } from "./economics.entity";

@Injectable()
@EntityRepository(EconomicsEntity)
export class EconomicsRepository extends GenericIngestService<EconomicsEntity> {
  constructor(
    @InjectRepository(EconomicsEntity)
    protected repository: Repository<EconomicsEntity>
  ) {
    super(repository);
  }
}
