import crypto from 'node:crypto';
import { InternalAuthContext } from '@studypal/types';

export function generateInternalToken(
  context: Omit<InternalAuthContext, 'timestamp'>,
  secret: string,
): string {
  const payload: InternalAuthContext = {
    ...context,
    timestamp: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifyInternalToken(
  token: string,
  secret: string,
  maxAgeMs = 5 * 60 * 1000, // 5 minutes validity
): InternalAuthContext {
  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid internal token format');
  }

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) {
    throw new Error('Missing token components');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedSigBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
  ) {
    throw new Error('Internal token signature verification failed');
  }

  const payloadString = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
  const payload: InternalAuthContext = JSON.parse(payloadString);

  if (Date.now() - payload.timestamp > maxAgeMs) {
    throw new Error('Internal token expired');
  }

  return payload;
}
