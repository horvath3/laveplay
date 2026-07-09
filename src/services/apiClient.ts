import { agentConfig } from "./config";

/**
 * Thin typed HTTP client for the Lave Agent REST API.
 *
 * Keeping all transport concerns (base URL, headers, error handling, JSON
 * parsing) here means the individual services stay small and focused on their
 * domain.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiConnectionError extends Error {
  constructor(
    message: string,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiConnectionError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${agentConfig.baseUrl}${path}`;
  let res: Response;

  if (!agentConfig.baseUrl) {
    throw new ApiConnectionError("VITE_API_BASE_URL is not configured.", url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), agentConfig.requestTimeoutMs);

    try {
      res = await fetch(url, {
        ...init,
        signal: init?.signal ?? controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    throw new ApiConnectionError("Lave Agent is offline or unreachable.", url);
  }

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.statusText}`, res.status, url);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const isAgentUnavailable = (error: unknown) =>
  error instanceof ApiConnectionError ||
  (error instanceof ApiError && (error.status === 0 || error.status >= 500));
