import { DaimsClient } from "./client";
import { DaimsApiError } from "./errors";
import type {
  GetPromptResponse,
  LegacyRequestOptions,
  SearchListResponse,
  SearchRequestParams,
} from "./types";

function createLegacyClient(options?: LegacyRequestOptions): DaimsClient {
  if (!options?.apiKey) {
    throw new DaimsApiError(
      "apiKey is required. Use search(params, { apiKey }) or new DaimsClient({ apiKey }).",
      {
        code: "CONFIG_ERROR",
      },
    );
  }

  return new DaimsClient(options);
}

/**
 * @deprecated Use `new DaimsClient({ apiKey }).search(params)` instead.
 */
export async function search(
  params: SearchRequestParams,
  options?: LegacyRequestOptions,
): Promise<SearchListResponse> {
  return createLegacyClient(options).search(params);
}

/**
 * @deprecated Use `new DaimsClient({ apiKey }).getPrompt(skey)` instead.
 */
export async function getPrompt(
  skey: string,
  options?: LegacyRequestOptions,
): Promise<GetPromptResponse> {
  return createLegacyClient(options).getPrompt(skey);
}

export { DaimsClient };
export { DaimsApiError };
export type * from "./types";
