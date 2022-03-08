import { forwardRef, Module } from "@nestjs/common";
import { AccountsModule } from "./accounts/accounts.module";
import { PricesModule } from "./prices/prices.module";

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    forwardRef(() => PricesModule),
  ],
  exports: [
    AccountsModule,
    PricesModule,
  ],
})
export class ResolversModule { }
