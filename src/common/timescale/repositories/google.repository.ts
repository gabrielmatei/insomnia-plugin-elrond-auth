import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { GoogleEntity } from "../entities/google.entity";

@Injectable()
@EntityRepository(GoogleEntity)
export class GoogleRepository extends GenericIngestService<GoogleEntity> {
  constructor(
    @InjectRepository(GoogleEntity)
    protected repository: Repository<GoogleEntity>
  ) {
    super(repository);
  }
}
