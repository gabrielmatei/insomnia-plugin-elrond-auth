import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { GithubEntity } from "../entities/github.entity";

@Injectable()
@EntityRepository(GithubEntity)
export class GithubRepository extends GenericIngestService<GithubEntity> {
  constructor(
    @InjectRepository(GithubEntity)
    protected repository: Repository<GithubEntity>
  ) {
    super(repository);
  }
}
