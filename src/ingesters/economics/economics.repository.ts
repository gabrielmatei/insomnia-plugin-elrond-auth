import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Economics } from "./economics.entity";

@Injectable()
@EntityRepository(Economics)
export class EconomicsRepository extends GenericIngestService<Economics> {
  constructor(
    @InjectRepository(Economics)
    protected repository: Repository<Economics>
  ) {
    super(repository);
  }
}
