import Constants from 'expo-constants';

export function getBackendBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri ? hostUri.split(':')[0] : null;

  if (host) return `http://${host}:3000`;
  return 'http://localhost:3000';
}

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { message: string; details?: unknown } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export async function apiFetch<T>(
  path: string,
  opts: { method?: string; headers?: Record<string, string>; body?: unknown; userId?: string } = {},
): Promise<T> {
  const url = `${getBackendBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(opts.userId ? { 'x-user-id': opts.userId } : {}),
      ...(opts.headers ?? {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (json && typeof json === 'object' && 'ok' in json) {
    if (json.ok) return (json as ApiOk<T>).data;
    throw new Error((json as ApiErr).error?.message ?? 'Request failed');
  }

  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return json as unknown as T;
}

