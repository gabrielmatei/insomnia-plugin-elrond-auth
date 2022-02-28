import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Google } from "./google.entity";

@Injectable()
@EntityRepository(Google)
export class GoogleRepository extends GenericIngestService<Google> {
  constructor(
    @InjectRepository(Google)
    protected repository: Repository<Google>
  ) {
    super(repository);
  }
}
