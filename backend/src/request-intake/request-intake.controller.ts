import { Body, Controller, Post } from '@nestjs/common';
import { RequestIntakeService } from './request-intake.service';

@Controller('request-intake')
export class RequestIntakeController {
  constructor(
    private readonly requestIntakeService: RequestIntakeService,
  ) {}

  @Post('suggest')
async suggest(@Body('requestText') requestText: string) {
  return this.requestIntakeService.suggest(requestText);
}

}