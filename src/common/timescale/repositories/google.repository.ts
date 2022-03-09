import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GoogleEntity } from "../entities/google.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(GoogleEntity)
export class GoogleRepository extends GenericIngestRepository<GoogleEntity> {
  constructor(
    @InjectRepository(GoogleEntity)
    protected repository: Repository<GoogleEntity>
  ) {
    super(repository);
  }
}
