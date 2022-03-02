import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { TwitterEntity } from "./twitter.entity";

@Injectable()
@EntityRepository(TwitterEntity)
export class TwitterRepository extends GenericIngestService<TwitterEntity> {
  constructor(
    @InjectRepository(TwitterEntity)
    protected repository: Repository<TwitterEntity>
  ) {
    super(repository);
  }
}
