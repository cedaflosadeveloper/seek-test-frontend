import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://seek-test-api.onrender.com';

const pickHeader = (req: NextRequest, name: string) => {
  const value = req.headers.get(name);
  return value ? { [name]: value } : {};
};

export const proxyRequest = async (req: NextRequest, path: string) => {
  const url = new URL(path, BACKEND_URL);
  url.search = req.nextUrl.search;

  const headers: Record<string, string> = {
    ...pickHeader(req, 'content-type'),
    ...pickHeader(req, 'authorization')
  };

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: body && body.length ? body : undefined,
      cache: 'no-store'
    });

    const contentType = response.headers.get('content-type') ?? '';
    const noStoreHeaders = {
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    };
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status, headers: noStoreHeaders });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        ...(contentType ? { 'content-type': contentType } : {}),
        ...noStoreHeaders
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unavailable';
    return NextResponse.json(
      { message },
      {
        status: 502,
        headers: { 'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
      }
    );
  }
};
