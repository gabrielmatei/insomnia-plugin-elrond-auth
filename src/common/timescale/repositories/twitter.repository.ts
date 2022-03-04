import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericIngestService } from "src/ingesters/generic-ingest.service";
import { EntityRepository, Repository } from "typeorm";
import { TwitterEntity } from "../entities/twitter.entity";

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
