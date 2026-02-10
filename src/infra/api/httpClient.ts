import 'client-only';

import type { HttpClient, HttpRequest, HttpResponse } from '@/core/ports/httpClient';
import { tokenStorage } from '@/infra/storage/tokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/** Normaliza el endpoint respetando base URL y rutas internas. */
const buildUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  if (!API_BASE_URL || path.startsWith('/api')) return path;
  const base = API_BASE_URL.replace(/\/+$/, '');
  return `${base}${path}`;
};

/** Traduce la respuesta de error a un mensaje legible. */
const parseErrorMessage = (data: unknown, status: number) => {
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: string | string[] }).message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  if (data && typeof data === 'object' && 'error' in data) {
    const error = (data as { error?: string }).error;
    if (typeof error === 'string') return error;
  }
  return `HTTP ${status}`;
};

/** Cliente HTTP para el frontend. */
export const httpClient: HttpClient = {
  async request<T>(req: HttpRequest): Promise<HttpResponse<T>> {
    const token = tokenStorage.get();

    const headers: Record<string, string> = {};
    if (req.body) headers['Content-Type'] = 'application/json';
    if (req.requiresAuth && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(buildUrl(req.url), {
      method: req.method,
      headers,
      body: req.body ? JSON.stringify(req.body) : undefined
    });

    const contentType = response.headers.get('content-type') ?? '';
    const hasJson = contentType.includes('application/json');
    let data: unknown = null;
    if (hasJson) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      const text = await response.text();
      data = text.length ? text : null;
    }

    if (!response.ok) {
      throw new Error(parseErrorMessage(data, response.status));
    }

    return { data: data as T };
  }
};
