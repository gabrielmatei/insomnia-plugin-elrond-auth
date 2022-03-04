import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/common/api-config/api.config.service';


@Injectable()
export class FetcherService {
    constructor(
        private apiConfigService: ApiConfigService,
    ) { }

    public test(): string {
        return this.apiConfigService.getApiUrl();
    }
}
