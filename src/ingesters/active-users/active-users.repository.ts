import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityRepository, Repository } from "typeorm";
import { GenericIngestService } from "../generic/generic-ingest.service";
import { ActiveUsersEntity } from "./active-users.entity";

@Injectable()
@EntityRepository(ActiveUsersEntity)
export class ActiveUsersRepository extends GenericIngestService<ActiveUsersEntity> {
  constructor(
    @InjectRepository(ActiveUsersEntity)
    protected repository: Repository<ActiveUsersEntity>
  ) {
    super(repository);
  }
}
