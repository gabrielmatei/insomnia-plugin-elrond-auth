import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TokensResolver } from './tokens.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [TokensResolver],
  exports: [],
})
export class TokensModule { }
