import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { CachingModule } from "../caching/caching.module";
import { GithubService } from "./github.service";

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => CachingModule),
  ],
  providers: [
    GithubService,
  ],
  exports: [
    GithubService,
  ],
})
export class GithubModule { }
