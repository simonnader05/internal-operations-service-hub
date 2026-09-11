import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsModule } from './requests/requests.module';
import { Request } from './requests/request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/service-hub.db',
      entities: [Request],
      synchronize: true,
    }),
    RequestsModule,
  ],
})
export class AppModule {}