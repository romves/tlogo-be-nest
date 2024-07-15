import { Test, TestingModule } from '@nestjs/testing';
import { UmkmController } from './umkm.controller';

describe('UmkmController', () => {
  let controller: UmkmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UmkmController],
    }).compile();

    controller = module.get<UmkmController>(UmkmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
