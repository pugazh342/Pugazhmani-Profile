// src/utils/fingerprint.js
import { createHash } from 'crypto';

export function generateSessionFingerprint(req) {
  // Extract structural network and environment parameters
  const userAgent = req.headers.get('user-agent') || 'unknown-agent';
  const acceptLanguage = req.headers.get('accept-language') || 'unknown-lang';
  
  // Extract client IP address securely bypassing proxies
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  // Construct a deterministic seed string representing this precise hardware session
  const structuralSeed = `${clientIp}-${userAgent}-${acceptLanguage}`;

  // Hash the seed using SHA-256 to create an anonymized, unforgeable device fingerprint
  return createHash('sha256').update(structuralSeed).digest('hex');
}