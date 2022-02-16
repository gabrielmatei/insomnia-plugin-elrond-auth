import { Module } from "@nestjs/common";
import { ExampleModule } from "./example/example.module";
import { TestSocketModule } from "./test-sockets/test.socket.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    ExampleModule,
    WalletModule,
    TestSocketModule,
  ],
  exports: [
    ExampleModule,
    WalletModule,
    TestSocketModule,
  ],
})
export class EndpointsServicesModule { }
