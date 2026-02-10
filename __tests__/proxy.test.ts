jest.mock('next/server', () => {
  const redirect = jest.fn((url: URL) => ({ type: 'redirect', url: url.toString() }));
  const json = jest.fn((body: unknown, init?: { status?: number }) => ({ type: 'json', body, init }));
  const next = jest.fn(() => ({ type: 'next' }));
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

describe('proxy middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when visiting tasks without token', () => {
    const response = proxy(makeRequest('/tasks'));
    expect(NextResponse.redirect).toHaveBeenCalled();
    expect(response).toEqual({ type: 'redirect', url: 'http://localhost:3001/login' });
  });

  it('returns 401 json when requesting api tasks without token', () => {
    const response = proxy(makeRequest('/api/tasks'));
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'No autorizado' }, { status: 401 });
    expect(response).toEqual({ type: 'json', body: { message: 'No autorizado' }, init: { status: 401 } });
  });

  it('allows requests when token is present', () => {
    const response = proxy(makeRequest('/tasks', 'token'));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toEqual({ type: 'next' });
  });

  it('allows api requests when token is present', () => {
    const response = proxy(makeRequest('/api/tasks/1', 'token'));
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toEqual({ type: 'next' });
  });

  it('exports matcher config', () => {
    expect(config.matcher).toEqual(['/tasks/:path*', '/api/tasks/:path*']);
  });
});
