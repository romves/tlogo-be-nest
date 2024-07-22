import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseFileUploadService } from './supabase-file-upload.service';

describe('SupabaseFileUploadService', () => {
  let service: SupabaseFileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseFileUploadService],
    }).compile();

    service = module.get<SupabaseFileUploadService>(SupabaseFileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
