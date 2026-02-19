import { DaimsApiError } from "./errors";
import { requestJson } from "./http";
import type {
  DaimsClientOptions,
  GetPromptResponse,
  SearchResponse,
  SearchRequestParams,
} from "./types";

/**
 * API client for interacting with the DAIMS endpoints.
 */
export class DaimsClient {
  private readonly apiKey?: string;
  private readonly timeoutMs?: number;
  private readonly fetchImpl?: typeof fetch;
  public readonly imageBaseUrl: string;

  /**
   * Creates a new DAIMS API client.
   *
   * @param options - Client configuration.
   */
  constructor(options: DaimsClientOptions = {}) {
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs;
    this.fetchImpl = options.fetch;
    this.imageBaseUrl = "https://asset.daims.ai/images";
  }

  /**
   * Searches prompt cards.
   *
   * Sends `POST /api/search`.
   *
   * @param params - Search request payload.
   * @returns Search response containing success and paginated result data.
   * @throws {DaimsApiError} On validation, network, timeout, or HTTP errors.
   */
  async search(params: SearchRequestParams): Promise<SearchResponse> {
    const body: Record<string, unknown> = {
      card_type: params.card_type,
      search_type: params.search_type,
      value: params.value,
    };

    if (params.link !== undefined) {
      body.link = params.link;
    }

    if (params.isPhoto !== undefined) {
      body.isPhoto = params.isPhoto;
    }

    return requestJson<SearchResponse>({
      apiKey: this.apiKey,
      path: "/api/search",
      body,
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
    });
  }

  /**
   * Retrieves prompt details for a card key.
   *
   * Sends `POST /api/card`.
   *
   * @param skey - Card key returned from search results.
   * @returns Prompt detail data for the specified card key.
   * @throws {DaimsApiError} If `skey` is empty or the request fails.
   */
  async getPrompt(skey: string): Promise<GetPromptResponse> {
    if (!skey) {
      throw new DaimsApiError("skey is required.", {
        code: "VALIDATION_ERROR",
      });
    }

    return requestJson<GetPromptResponse>({
      apiKey: this.apiKey,
      path: "/api/card",
      body: { skey },
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
    });
  }
}
