import { Injectable } from "@nestjs/common";
import { TimescaleService } from "src/common/timescale/timescale.service";

@Injectable()
export class WalletService {
  constructor(private readonly timescaleService: TimescaleService,
  ) { }

  public async getNewWallets(): Promise<any> {
    const newWallets = await this.timescaleService.readData('test_hyper', 'a');
    return newWallets;
  }
}
