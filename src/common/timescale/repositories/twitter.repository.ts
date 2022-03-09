import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { TwitterEntity } from "../entities/twitter.entity";
import { GenericIngestRepository } from "./generic-ingest.repository";

@Injectable()
@EntityRepository(TwitterEntity)
export class TwitterRepository extends GenericIngestRepository<TwitterEntity> {
  constructor(
    @InjectRepository(TwitterEntity)
    protected repository: Repository<TwitterEntity>
  ) {
    super(repository);
  }
}
