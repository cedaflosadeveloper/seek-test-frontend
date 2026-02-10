jest.mock('next/server', () => {
  const withCookies = (payload: Record<string, unknown>) => ({
    ...payload,
    cookies: { set: jest.fn() }
  });
  const redirect = jest.fn((url: URL) => withCookies({ type: 'redirect', url: url.toString() }));
  const json = jest.fn((body: unknown, init?: { status?: number }) => withCookies({ type: 'json', body, init }));
  const next = jest.fn(() => withCookies({ type: 'next' }));
  return {
    NextResponse: { redirect, json, next },
    NextRequest: class {}
  };
});

import { proxy, config } from '@/proxy';
import { NextResponse } from 'next/server';

type MockRequest = {
  cookies: { get: (key: string) => { value: string } | undefined };
  nextUrl: { pathname: string };
  url: string;
};

const makeRequest = (path: string, token?: string): MockRequest => ({
  cookies: {
    get: (key: string) => (key === 'task_app_token' && token ? { value: token } : undefined)
  },
  nextUrl: { pathname: path },
  url: `http://localhost:3001${path}`
});

const makeToken = (exp: number) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encode = (data: Record<string, unknown>) => Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${encode(header)}.${encode({ exp })}.signature`;
};

describe('proxy middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when visiting tasks without token', () => {
    const response = proxy(makeRequest('/tasks'));
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(response).toMatchObject({ type: 'redirect', url: 'http://localhost:3001/login' });
  });

  it('returns 401 json when requesting api tasks without token', () => {
    const response = proxy(makeRequest('/api/tasks'));
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'No autorizado' }, { status: 401 });
    expect(response).toMatchObject({ type: 'json', body: { message: 'No autorizado' }, init: { status: 401 } });
  });

  it('allows requests when token is present', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) + 60);
    const response = proxy(makeRequest('/tasks', token));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toMatchObject({ type: 'next' });
  });

  it('allows api requests when token is present', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) + 60);
    const response = proxy(makeRequest('/api/tasks/1', token));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toMatchObject({ type: 'next' });
  });

  it('clears cookies and redirects when token is expired', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) - 10);
    const response = proxy(makeRequest('/tasks', token)) as { cookies: { set: jest.Mock } };
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(response.type).toBe('redirect');
    expect(response.cookies.set).toHaveBeenCalledWith('task_app_token', '', expect.any(Object));
    expect(response.cookies.set).toHaveBeenCalledWith('task_app_user', '', expect.any(Object));
  });

  it('clears cookies and returns 401 when api token is expired', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) - 10);
    const response = proxy(makeRequest('/api/tasks', token)) as { cookies: { set: jest.Mock } };
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Sesión expirada' }, { status: 401 });
    expect(response.type).toBe('json');
    expect(response.cookies.set).toHaveBeenCalledWith('task_app_token', '', expect.any(Object));
    expect(response.cookies.set).toHaveBeenCalledWith('task_app_user', '', expect.any(Object));
  });

  it('exports matcher config', () => {
    expect(config.matcher).toEqual(['/tasks/:path*', '/api/tasks/:path*']);
  });
});
