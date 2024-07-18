import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UmkmModule } from './module/umkm/umkm.module';

import { UsersModule } from './module/users/users.module';
// import { CommonModule } from './module/common/common.module';
import { PrismaModule } from './module/common/prisma/prisma.module';
import { ValidationModule } from './module/common/validation/validation.module';
import { ErrorFilter } from './module/common/filter/error/error.filter';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UmkmModule,
    ValidationModule,
    AuthModule,
    UsersModule,
    // CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
