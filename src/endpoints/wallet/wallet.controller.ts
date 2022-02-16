import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { WalletService } from "./wallet.service";

@Controller("wallets")
@ApiTags("wallets")
export class WalletController {
	constructor(
		private readonly walletService: WalletService
	) { }

	@Get("/")
	@ApiResponse({
		status: 200,
		description: '',
	})
	async getWallets(): Promise<any> {
		return await this.walletService.getNewWallets();
	}
}
