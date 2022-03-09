import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class GenericIngestRepository<T> {
  constructor(
    protected repository: Repository<T>
  ) { }

  public async create(model: T): Promise<T> {
    return await this.repository.save(model);
  }
}
