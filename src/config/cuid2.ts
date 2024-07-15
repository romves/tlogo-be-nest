import { init } from '@paralleldrive/cuid2';

function createId(fingerprint: string) {
  return init({
    fingerprint: fingerprint,
    
  });
}
