import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Twitter } from "./twitter.entity";

@Injectable()
@EntityRepository(Twitter)
export class TwitterRepository extends GenericIngestService<Twitter> {
  constructor(
    @InjectRepository(Twitter)
    protected repository: Repository<Twitter>
  ) {
    super(repository);
  }
}
