import { secureHeaders } from 'hono/secure-headers';

export const securityHeaders = secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'no-referrer',
});
