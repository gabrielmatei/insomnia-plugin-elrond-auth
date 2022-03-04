import { Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { GithubService } from "./github.service";

@Module({
  imports: [
    ApiConfigModule,
  ],
  providers: [
    GithubService,
  ],
  exports: [
    GithubService,
  ],
})
export class GithubModule { }
