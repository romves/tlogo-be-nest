import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UmkmService } from './umkm.service';
import { Response } from 'express';
import { TransformInterceptor } from 'src/interceptors/transform/transform.interceptor';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CreateUmkm, createUmkmSchema } from './model/create-umkm';
import { UMKM } from '@prisma/client';
import { UpdateUmkm, updateUmkmSchema } from './model/update-umkm';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('umkm')
export class UmkmController {
  constructor(private service: UmkmService) {}

  @Get('/')
  getAll() {
    return this.service.getAllUmkm();
  }

  @Get('/:id')
  getById(@Param('id') id: string, res: Response) {
    return this.service.getUmkmById(id);
  }

  @Post('/')
  create(@Body(new ValidationPipe(createUmkmSchema)) body: CreateUmkm) {
    return this.service.createUmkm(body);
  }

  @Post('/batch')
  @UseInterceptors(FileInterceptor('csv'))
  createBatch(@UploadedFile() file: any) {
    return this.service.createUmkmBatchCSV(file);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe(updateUmkmSchema)) body: UpdateUmkm,
  ) {
    return this.service.updateUmkm(id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, res: Response) {
    return this.service.deleteUmkm(id);
  }
}
