import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { MaiarDexEntity } from "../entities/maiar-dex.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(MaiarDexEntity)
export class MaiarDexRepository extends GenericIngestRepository<MaiarDexEntity> {
  constructor(
    @InjectRepository(MaiarDexEntity)
    protected repository: Repository<MaiarDexEntity>
  ) {
    super(repository);
  }
}
