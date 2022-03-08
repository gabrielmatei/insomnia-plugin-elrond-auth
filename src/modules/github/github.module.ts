import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GithubActivityResolver } from './github-activity.resolver';
import { GithubResolver } from './github.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [GithubResolver, GithubActivityResolver],
  exports: [],
})
export class GithubModule { }
