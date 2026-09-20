import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestIntakeModule } from './request-intake/request-intake.module';
import { Request } from './requests/request.entity';
import { RequestsModule } from './requests/requests.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/service-hub.db',
      entities: [Request],
      synchronize: true,
    }),
    RequestsModule,
    RequestIntakeModule,
  ],
})
export class AppModule {}