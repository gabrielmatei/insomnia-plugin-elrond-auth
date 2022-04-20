import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { MicroserviceModule } from "../microservice/microservice.module";
import { TradingService } from "./trading.service";

@Module({
  imports: [
    CommonModule,
    MicroserviceModule,
  ],
  providers: [
    TradingService,
  ],
  exports: [
    TradingService,
  ],
})
export class TradingModule { }
