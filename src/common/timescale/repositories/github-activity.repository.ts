import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GithubActivityEntity } from "../entities/github-activity.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(GithubActivityEntity)
export class GithubActivityRepository extends GenericIngestRepository<GithubActivityEntity> {
  constructor(
    @InjectRepository(GithubActivityEntity)
    protected repository: Repository<GithubActivityEntity>
  ) {
    super(repository);
  }
}
