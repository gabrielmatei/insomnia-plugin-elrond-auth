import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';
import { EndpointsServicesModule } from 'src/endpoints/endpoints.services.module';
import { CommonModule } from '../common/common.module';
import { DataIngesterService } from './data.ingester.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => CommonModule),
    forwardRef(() => EndpointsServicesModule),
    MicroserviceModule,
  ],
  providers: [
    DataIngesterService,
  ],
})
export class DataIngesterModule { }
