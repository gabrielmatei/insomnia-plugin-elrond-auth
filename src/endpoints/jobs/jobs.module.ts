import { forwardRef, Module } from "@nestjs/common";
import { CachingModule } from "src/common/caching/caching.module";
import { JobsService } from "./jobs.service";

@Module({
  imports: [
    forwardRef(() => CachingModule),
  ],
  providers: [
    JobsService,
  ],
  exports: [
    JobsService,
  ],
})
export class JobsModule { }
