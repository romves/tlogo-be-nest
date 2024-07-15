import { Test, TestingModule } from '@nestjs/testing';
import { UmkmService } from './umkm.service';

describe('UmkmService', () => {
  let service: UmkmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UmkmService],
    }).compile();

    service = module.get<UmkmService>(UmkmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
