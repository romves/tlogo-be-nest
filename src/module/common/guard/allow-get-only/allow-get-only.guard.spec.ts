import { AllowGetOnlyGuard } from './allow-get-only.guard';

describe('AllowGetOnlyGuard', () => {
  it('should be defined', () => {
    expect(new AllowGetOnlyGuard()).toBeDefined();
  });
});
