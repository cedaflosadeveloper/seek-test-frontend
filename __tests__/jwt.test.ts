import { isJwtExpired } from '@/shared/utils/jwt';

const makeToken = (payload: Record<string, unknown>) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encode = (data: Record<string, unknown>) => Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${encode(header)}.${encode(payload)}.signature`;
};

describe('jwt utils', () => {
  it('detects expired tokens', () => {
    const now = Date.now();
    const token = makeToken({ exp: Math.floor(now / 1000) - 10 });
    expect(isJwtExpired(token, now)).toBe(true);
  });

  it('detects valid tokens', () => {
    const now = Date.now();
    const token = makeToken({ exp: Math.floor(now / 1000) + 60 });
    expect(isJwtExpired(token, now)).toBe(false);
  });

  it('treats invalid tokens as expired', () => {
    expect(isJwtExpired('not-a-token')).toBe(true);
  });
});
