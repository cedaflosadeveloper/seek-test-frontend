export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpRequest = {
  method: HttpMethod;
  url: string;
  body?: unknown;
  requiresAuth?: boolean;
};

export type HttpResponse<T> = {
  data: T;
};

export interface HttpClient {
  request<T>(req: HttpRequest): Promise<HttpResponse<T>>;
}
