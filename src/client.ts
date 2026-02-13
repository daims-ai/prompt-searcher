import { DaimsApiError } from "./errors";
import { requestJson } from "./http";
import type {
  DaimsClientOptions,
  GetPromptResponse,
  SearchListResponse,
  SearchRequestParams,
} from "./types";

export class DaimsClient {
  private readonly apiKey: string;
  private readonly timeoutMs?: number;
  private readonly fetchImpl?: typeof fetch;

  constructor(options: DaimsClientOptions) {
    if (!options?.apiKey) {
      throw new DaimsApiError("apiKey is required to initialize DaimsClient.", {
        code: "CONFIG_ERROR",
      });
    }

    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs;
    this.fetchImpl = options.fetch;
  }

  async search(params: SearchRequestParams): Promise<SearchListResponse> {
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

    return requestJson<SearchListResponse>({
      apiKey: this.apiKey,
      path: "/api/search",
      body,
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
    });
  }

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
