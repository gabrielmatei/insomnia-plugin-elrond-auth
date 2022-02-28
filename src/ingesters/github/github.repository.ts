import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Github } from "./github.entity";

@Injectable()
@EntityRepository(Github)
export class GithubRepository extends GenericIngestService<Github> {
  constructor(
    @InjectRepository(Github)
    protected repository: Repository<Github>
  ) {
    super(repository);
  }
}
