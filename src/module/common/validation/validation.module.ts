import { DynamicModule, Module } from '@nestjs/common';
import { ValidationService } from './validation.service';

@Module({})
export class ValidationModule {
  static forRoot(isGlobal: boolean | undefined): DynamicModule {
    return {
      global: isGlobal,
      module: ValidationModule,
      providers: [ValidationService],
      exports: [ValidationService],
    };
  }
}
