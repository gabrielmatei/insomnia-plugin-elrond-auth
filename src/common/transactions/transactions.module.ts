import { forwardRef, Module } from "@nestjs/common";
import { ApiConfigModule } from "../api-config/api.config.module";
import { CachingModule } from "../caching/caching.module";
import { ApiModule } from "../network/api.module";
import { TransactionsService } from "./transactions.service";

@Module({
  imports: [
    ApiConfigModule,
    ApiModule,
    forwardRef(() => CachingModule),
  ],
  providers: [
    TransactionsService,
  ],
  exports: [
    TransactionsService,
  ],
})
export class TransactionsModule { }
