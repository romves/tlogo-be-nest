import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UmkmModule } from './module/umkm/umkm.module';

// import { CommonModule } from './module/common/common.module';
import { PrismaModule } from './module/common/prisma/prisma.module';
import { ValidationModule } from './module/common/validation/validation.module';
import { ErrorFilter } from './module/common/filter/error/error.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './module/auth/guard/jwt/jwt.guard';
import { UserModule } from './module/users/user.module';

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
    UserModule,
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
