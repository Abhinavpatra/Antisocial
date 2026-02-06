import Constants from 'expo-constants';

// ── Networking helpers ───────────────────────────────────────────────

/** Thrown when a request fails due to network issues (offline, timeout, DNS) */
export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

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

const DEFAULT_TIMEOUT_MS = 10_000;

export async function apiFetch<T>(
  path: string,
  opts: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    userId?: string;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  const url = `${getBackendBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers: {
        'content-type': 'application/json',
        ...(opts.userId ? { 'x-user-id': opts.userId } : {}),
        ...(opts.headers ?? {}),
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
    });
  } catch (e: unknown) {
    // Network failure, DNS failure, timeout (AbortError), etc.
    throw new NetworkError(
      e instanceof Error ? e.message : 'Network request failed',
    );
  } finally {
    clearTimeout(timeout);
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (json && typeof json === 'object' && 'ok' in json) {
    if (json.ok) return (json as ApiOk<T>).data;
    throw new Error((json as ApiErr).error?.message ?? 'Request failed');
  }

  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return json as unknown as T;
}

/** Returns true if the error is a network/offline error (vs. an API/business error) */
export function isNetworkError(e: unknown): e is NetworkError {
  return e instanceof NetworkError;
}
