import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { MaiarDexModule } from "../maiar-dex/maiar-dex.module";
import { MicroserviceModule } from "../microservice/microservice.module";
import { TradingService } from "./trading.service";

@Module({
  imports: [
    CommonModule,
    MaiarDexModule,
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
