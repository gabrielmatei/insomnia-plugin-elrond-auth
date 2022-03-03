import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { GithubActivityEntity } from "../entities/github-activity.entity";

@Injectable()
@EntityRepository(GithubActivityEntity)
export class GithubActivityRepository extends GenericIngestService<GithubActivityEntity> {
  constructor(
    @InjectRepository(GithubActivityEntity)
    protected repository: Repository<GithubActivityEntity>
  ) {
    super(repository);
  }
}
