import { Injectable } from '@nestjs/common';
import { ApiUtils } from 'src/utils/api.utils';
import { ApiConfigService } from '../api-config/api.config.service';
import { EsdtToken } from '../maiar-dex/entities/pair';
// import { MaiarDexService } from '../maiar-dex/maiar-dex.service';
import { ApiService } from '../network/api.service';
import { SwapFixedInputEvent } from './entities/pair/swap-fixed-input.event';
import { SwapFixedOutputEvent } from './entities/pair/swap-fixed-output.event';

@Injectable()
export class RabbitMqPairHandlerService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    // private readonly maiarDexService: MaiarDexService
  ) { }

  public async handleSwapEvent(
    event: SwapFixedInputEvent | SwapFixedOutputEvent,
  ): Promise<void> {
    const firstToken = await this.getToken(event.getTokenIn().tokenID);
    let first: any = {
      identifier: firstToken.identifier,
      token: firstToken,
      reserves: event.getTokenInReserves().shiftedBy(-firstToken.decimals),
      volume: event.getTokenIn().amount.shiftedBy(-firstToken.decimals),
    };

    const secondToken = await this.getToken(event.getTokenOut().tokenID);
    let second = {
      identifier: secondToken.identifier,
      token: secondToken,
      reserves: event.getTokenOutReserves().shiftedBy(-secondToken.decimals),
      volume: event.getTokenOut().amount.shiftedBy(-secondToken.decimals),
    };


    if (first.identifier === 'WEGLD-d7c6bb') {
      const temp = first;
      first = second;
      second = temp;
    }

    console.log({ first, second });

    const data: any = {
      pair: `${EsdtToken.getTicker(first.token)} / ${EsdtToken.getTicker(second.token)}`,
      price: second.reserves.dividedBy(first.reserves).toString(10),
      volume: first.volume.toString(10),
    };
    console.log(data);

    return;
  }

  async getToken(identifier: string): Promise<EsdtToken> {
    // TODO check
    const tokenRaw = await this.apiService.get<EsdtToken>(`${this.apiConfigService.getApiUrl()}/tokens/${identifier} `);
    return ApiUtils.mergeObjects(new EsdtToken(), tokenRaw);
  }
}
