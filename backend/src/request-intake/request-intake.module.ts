import { Module } from '@nestjs/common';
import { RequestIntakeController } from './request-intake.controller';
import { RequestIntakeService } from './request-intake.service';

@Module({
  controllers: [RequestIntakeController],
  providers: [RequestIntakeService],
})
export class RequestIntakeModule {}