import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { GatewayModule } from "../gateway/gateway.module";
import { StakingService } from "./staking.service";

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => GatewayModule),
  ],
  providers: [
    StakingService,
  ],
  exports: [
    StakingService,
  ],
})
export class StakingModule { }
