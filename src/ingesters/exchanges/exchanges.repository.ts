import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { Exchanges } from "./exchanges.entity";

@Injectable()
@EntityRepository(Exchanges)
export class ExchangesRepository extends GenericIngestService<Exchanges> {
  constructor(
    @InjectRepository(Exchanges)
    protected repository: Repository<Exchanges>
  ) {
    super(repository);
  }
}
