import { DaimsApiError } from "./errors";

interface RequestJsonOptions {
  apiKey: string;
  path: string;
  body?: unknown;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const API_BASE_URL = "https://api.daims.ai";

function getMessageFromBody(body: unknown): string | undefined {
  if (typeof body === "string" && body.length > 0) {
    return body;
  }

  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return undefined;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.toLowerCase().includes("application/json");

  if (isJson) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

export async function requestJson<T>(options: RequestJsonOptions): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  if (typeof fetchImpl !== "function") {
    throw new DaimsApiError("Global fetch is not available in this runtime.", {
      code: "FETCH_UNAVAILABLE",
    });
  }

  const controller = new AbortController();
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    const url = new URL(options.path, API_BASE_URL).toString();
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options.body ?? {}),
      signal: controller.signal,
    });

    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
      const responseMessage = getMessageFromBody(responseBody);
      throw new DaimsApiError(
        responseMessage ?? `Request failed with status ${response.status}`,
        {
          status: response.status,
          code: "HTTP_ERROR",
          responseBody,
        },
      );
    }

    return responseBody as T;
  } catch (error: unknown) {
    if (error instanceof DaimsApiError) {
      throw error;
    }

    if (didTimeout || (error instanceof Error && error.name === "AbortError")) {
      throw new DaimsApiError(`Request timed out after ${timeoutMs}ms`, {
        code: "REQUEST_TIMEOUT",
        cause: error,
      });
    }

    throw new DaimsApiError("Network request failed", {
      code: "NETWORK_ERROR",
      cause: error,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
