import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { GoogleEntity } from "./google.entity";

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
