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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, query } from 'express';
import { CreateUmkm, createUmkmSchema } from './model/create-umkm';
import { UpdateUmkm, updateUmkmSchema } from './model/update-umkm';
import { UmkmService } from './umkm.service';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { OmitDataByRoleInterceptor } from './interceptors/role.interceptor/role.interceptor.';
import { TQuery } from '../common/types/query.types';

@Controller('umkm')
export class UmkmController {
  constructor(private service: UmkmService) {}

  @Get('/')
  @UseInterceptors(new OmitDataByRoleInterceptor())
  getAll(@Query() query: TQuery) {
    return this.service.getAllUmkm(query);
  }

  @Get('/maps')
  @UseInterceptors(new OmitDataByRoleInterceptor())
  getAllUMKMLoc() {
    return this.service.getUMKMforMaps();
  }

  @Get('/:id')
  @UseInterceptors(new OmitDataByRoleInterceptor())
  getById(@Param('id') id: string, res: Response) {
    return this.service.getUmkmById(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  create(@Body(new ZodValidationPipe(createUmkmSchema)) body: CreateUmkm) {
    return this.service.createUmkm(body);
  }

  @Post('/batch')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('csv'))
  createBatch(@UploadedFile() file: any) {
    return this.service.createUmkmBatchCSV(file);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUmkmSchema)) body: UpdateUmkm,
  ) {
    return this.service.updateUmkm(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, res: Response) {
    return this.service.deleteUmkm(id);
  }
}
