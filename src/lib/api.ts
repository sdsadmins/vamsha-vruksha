// HTTP client for the Human Link API (the NestJS server).
//
// Everything the app knows about talking to the backend lives here: where it
// is, how the bearer token gets attached, and what an error looks like. Pages
// call apiGet/apiPost/… and never see a URL or a header.

import { clearSession, getToken } from "./auth";

/**
 * The API is a separate origin (its own host in production, localhost while
 * developing), so this must be an absolute URL. It is read at build time by
 * Next, which is why it carries the NEXT_PUBLIC_ prefix.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

/** A non-2xx response. `status` lets callers branch; `message` is safe to show. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  /** Send the request without an Authorization header (login, register, OTP). */
  anonymous?: boolean;
  /** Query parameters; undefined/empty values are dropped. */
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

/**
 * Nest replies with `{statusCode, message, error}`, where `message` is an
 * array of strings when the global ValidationPipe rejects a body. Flatten both
 * shapes into one line a component can render.
 */
function messageFrom(body: unknown, status: number): string {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) return message.filter(Boolean).join(". ");
    if (typeof message === "string" && message) return message;
    const error = (body as { error?: unknown }).error;
    if (typeof error === "string" && error) return error;
  }
  return `Request failed (${status})`;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(
    path.startsWith("/") ? path : `/${path}`,
    API_BASE_URL || window.location.origin,
  );
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (!options.anonymous) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options.signal,
    });
  } catch (err) {
    // fetch only rejects on a transport failure — the server being down, DNS,
    // CORS. Worth its own message, because "failed to fetch" tells a member
    // nothing.
    if ((err as Error)?.name === "AbortError") throw err;
    throw new ApiError(0, "Cannot reach the server. Check your connection.");
  }

  const text = await res.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    // An expired or forged token means the session is over. Drop it here so a
    // stale token cannot keep every subsequent page half-working.
    if (res.status === 401 && !options.anonymous) {
      clearSession();
      if (typeof window !== "undefined" && !isAuthPage()) {
        window.location.href = "/login";
      }
    }
    throw new ApiError(res.status, messageFrom(parsed, res.status), parsed);
  }

  return parsed as T;
}

/** Login/register already handle their own 401s; don't bounce off them. */
function isAuthPage(): boolean {
  const path = window.location.pathname;
  return path.startsWith("/login") || path.startsWith("/register");
}

export const apiGet = <T>(path: string, options?: RequestOptions) =>
  request<T>("GET", path, undefined, options);

export const apiPost = <T>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>("POST", path, body, options);

export const apiPut = <T>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>("PUT", path, body, options);

export const apiPatch = <T>(path: string, body?: unknown, options?: RequestOptions) =>
  request<T>("PATCH", path, body, options);

export const apiDelete = <T>(path: string, options?: RequestOptions) =>
  request<T>("DELETE", path, undefined, options);

/** Error text for a caught unknown, for `catch (err) { setError(errorMessage(err)) }`. */
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
