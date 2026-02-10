type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

const decodeBase64Url = (input: string): string | null => {
  try {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    return atob(base64);
  } catch {
    return null;
  }
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) return null;
  try {
    const data = JSON.parse(decoded) as JwtPayload;
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string, now = Date.now()): boolean => {
  const payload = parseJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return payload.exp <= Math.floor(now / 1000);
};
