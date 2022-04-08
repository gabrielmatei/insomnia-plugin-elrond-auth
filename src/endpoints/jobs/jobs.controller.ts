import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAdminGuard } from "src/utils/guards/jwt.admin.guard";
import { JwtAuthenticateGuard } from "src/utils/guards/jwt.authenticate.guard";
import { ParseOptionalEnumPipe } from "src/utils/pipes/parse.optional.enum.pipe";
import { JobType } from "./entities/job.type";
import { JobsService } from "./jobs.service";

@Controller('jobs')
@ApiTags('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @UseGuards(JwtAuthenticateGuard, JwtAdminGuard)
  @Post("/:job/run")
  public async runJob(
    @Param('job', new ParseOptionalEnumPipe(JobType)) jobType: JobType
  ): Promise<string> {
    return await this.jobsService.runJob(jobType);
  }
}
