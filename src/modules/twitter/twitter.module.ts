import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TwitterResolver } from './twitter.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [TwitterResolver],
  exports: [],
})
export class TwitterModule { }
