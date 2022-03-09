import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GithubEntity } from "../entities/github.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(GithubEntity)
export class GithubRepository extends GenericIngestRepository<GithubEntity> {
  constructor(
    @InjectRepository(GithubEntity)
    protected repository: Repository<GithubEntity>
  ) {
    super(repository);
  }
}
