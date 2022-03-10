import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { NftsResolver } from './nfts.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [NftsResolver],
  exports: [],
})
export class NftsModule { }
