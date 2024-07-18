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
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateUmkm, createUmkmSchema } from './model/create-umkm';
import { UpdateUmkm, updateUmkmSchema } from './model/update-umkm';
import { UmkmService } from './umkm.service';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';

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
  create(@Body(new ZodValidationPipe(createUmkmSchema)) body: CreateUmkm) {
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
    @Body(new ZodValidationPipe(updateUmkmSchema)) body: UpdateUmkm,
  ) {
    return this.service.updateUmkm(id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, res: Response) {
    return this.service.deleteUmkm(id);
  }
}
