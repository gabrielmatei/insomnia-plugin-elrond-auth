import { Injectable } from "@nestjs/common";
import { PersistenceService } from "src/common/persistence/persistence.service";

@Injectable()
export class WalletService {
  constructor(private readonly persistenceService: PersistenceService,
  ) { }

  public async getNewWallets(): Promise<any> {
    const newWallets = await this.persistenceService.readData('');
    return newWallets;
  }
}
