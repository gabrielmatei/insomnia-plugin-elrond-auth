import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { StakingTypeResolver } from './staking-type.resolver';
import { StakingResolver } from './staking.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
  ],
  providers: [StakingResolver, StakingTypeResolver],
  exports: [],
})
export class StakingModule { }
