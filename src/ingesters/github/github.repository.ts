import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { GithubEntity } from "./github.entity";

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
