import { describe, expect, it, vi } from "vitest";
import { DaimsApiError, DaimsClient } from "../src/index";
import type { GetPromptResponse, SearchResponse } from "../src/types";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("DaimsClient", () => {
  it("sends search request with auth header and optional fields", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          count: 1,
          hasNext: false,
          limit: 20,
          offset: 0,
          items: [],
        },
        success: true,
      } satisfies SearchResponse),
    );

    const client = new DaimsClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.search({
      card_type: "create",
      search_type: "keyword",
      value: "cinematic",
      link: "https://example.com/image.png",
      isPhoto: false,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];

    expect(url).toBe("https://api.daims.ai/api/search");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer test-key",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(init.body as string)).toEqual({
      card_type: "create",
      search_type: "keyword",
      value: "cinematic",
      link: "https://example.com/image.png",
      isPhoto: false,
    });
  });

  it("sends getPrompt request with skey", async () => {
    const payload = {
      success: true,
      prompt: "prompt"
    } satisfies GetPromptResponse;

    const fetchMock = vi.fn(async () => jsonResponse(payload));

    const client = new DaimsClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const result = await client.getPrompt("card-key");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];

    expect(result).toEqual(payload);
    expect(url).toBe("https://api.daims.ai/api/card");
    expect(JSON.parse(init.body as string)).toEqual({ skey: "card-key" });
  });

  it("throws DaimsApiError with status and responseBody for http errors", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "unauthorized" }, 401),
    );

    const client = new DaimsClient({
      apiKey: "invalid",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const error = await client
      .search({ card_type: "create", search_type: "keyword", value: "x" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(DaimsApiError);
    expect(error).toMatchObject({
      code: "HTTP_ERROR",
      status: 401,
      responseBody: { message: "unauthorized" },
      message: "unauthorized",
    });
  });

  it("throws REQUEST_TIMEOUT when request exceeds timeout", async () => {
    const fetchMock = vi.fn(
      async (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(
              new DOMException("The operation was aborted.", "AbortError"),
            );
          });
        }),
    );

    const client = new DaimsClient({
      apiKey: "test-key",
      timeoutMs: 1,
      fetch: fetchMock as unknown as typeof fetch,
    });

    const error = await client
      .search({ card_type: "edit", search_type: "style", value: "warm tone" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(DaimsApiError);
    expect(error).toMatchObject({
      code: "REQUEST_TIMEOUT",
    });
  });

  it("throws NETWORK_ERROR on network failures", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("socket hang up");
    });

    const client = new DaimsClient({
      apiKey: "test-key",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const error = await client
      .search({ card_type: "create", search_type: "object", value: "lamp" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(DaimsApiError);
    expect(error).toMatchObject({
      code: "NETWORK_ERROR",
      message: "Network request failed",
    });
  });
});
