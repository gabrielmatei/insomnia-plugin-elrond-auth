import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ValuesResolver } from './values.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [ValuesResolver],
  exports: [],
})
export class ValuesModule { }
