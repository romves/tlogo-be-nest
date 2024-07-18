import { Module } from '@nestjs/common';
import { UmkmController } from './umkm.controller';
import { UmkmService } from './umkm.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule],
  controllers: [UmkmController],
  providers: [UmkmService],
})
export class UmkmModule {}
