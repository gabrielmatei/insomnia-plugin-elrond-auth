import { forwardRef, Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { WalletService } from "./wallet.service";

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [
    WalletService,
  ],
  exports: [
    WalletService,
  ],
})
export class WalletModule { }
