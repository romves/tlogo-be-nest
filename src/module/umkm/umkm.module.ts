import { Module } from '@nestjs/common';
import { UmkmController } from './umkm.controller';
import { UmkmService } from './umkm.service';

@Module({
  controllers: [UmkmController],
  providers: [UmkmService, ]
})
export class UmkmModule {}
