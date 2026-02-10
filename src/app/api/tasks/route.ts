import { NextRequest } from 'next/server';
import { proxyRequest } from '../_lib/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return proxyRequest(req, '/tasks');
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, '/tasks');
}
