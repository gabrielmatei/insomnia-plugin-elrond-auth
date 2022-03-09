import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GoogleResolver } from './google.resolver';
import { KeywordResolver } from './keyword.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [GoogleResolver, KeywordResolver],
  exports: [],
})
export class GoogleModule { }
