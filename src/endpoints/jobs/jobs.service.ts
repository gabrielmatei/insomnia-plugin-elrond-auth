import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class JobsService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(JobsService.name);
  }

  log() {
    this.logger.log('log');
  }
}
