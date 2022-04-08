import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";

@Controller('jobs')
@ApiTags('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Get("/")
  getHello(): string {
    this.jobsService.log();
    return 'jobs';
  }
}
