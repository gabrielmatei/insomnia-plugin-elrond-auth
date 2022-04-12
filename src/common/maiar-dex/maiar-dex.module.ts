import { Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { AWSModule } from "../aws/aws.module";
import { CachingModule } from "../caching/caching.module";
import { ApiModule } from "../network/api.module";
import { TimescaleModule } from "../timescale/timescale.module";
import { MaiarDexService } from "./maiar-dex.service";

@Module({
  imports: [
    ApiConfigModule,
    ApiModule,
    CachingModule,
    TimescaleModule,
    AWSModule,
  ],
  providers: [
    MaiarDexService,
  ],
  exports: [
    MaiarDexService,
  ],
})
export class MaiarDexModule { }
