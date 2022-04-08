import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";

@Module({
  imports: [
  ],
  providers: [
    JobsService,
  ],
  exports: [
    JobsService,
  ],
})
export class JobsModule { }
