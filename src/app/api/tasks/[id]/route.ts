import { NextRequest } from 'next/server';
import { proxyRequest } from '../../_lib/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/tasks/${id}`);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/tasks/${id}`);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/tasks/${id}`);
}
