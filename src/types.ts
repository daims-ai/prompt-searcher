/**
 * Parameters for `POST /api/search`.
 */
export interface SearchRequestParams {
  /**
   * Card category to search in.
   */
  card_type: "create" | "edit";
  /**
   * Search mode for the query value.
   */
  search_type: "keyword" | "style" | "object";
  /**
   * Search query string.
   */
  value: string;
  /**
   * Optional reference URL used by the API for context.
   */
  link?: string;
  /**
   * Indicates whether the input should be treated as a photo reference.
   */
  isPhoto?: boolean;
}

/**
 * Paginated payload returned in `data` from `POST /api/search`.
 */
export interface SearchListResponse {
  /**
   * Total number of matched items.
   */
  count: number;
  /**
   * Whether more pages are available after this response.
   */
  hasNext: boolean;
  /**
   * Page size used by the API.
   */
  limit: number;
  /**
   * Current page offset.
   */
  offset: number;
  /**
   * Search result items for the current page.
   */
  items: SearchListItem[];
}

/**
 * Response returned from `POST /api/search`.
 */
export interface SearchResponse {
  /**
   * Paginated search payload.
   */
  data: SearchListResponse;
  /**
   * Indicates request success.
   */
  success: boolean;
}

/**
 * Search result item from `POST /api/search`.
 */
export interface SearchListItem {
  /**
   * Unique card identifier.
   */
  id: string;
  /**
   * Metadata describing the card and model/provider context.
   */
  metadata: SearchListItemMetadata;
  /**
   * Reference URLs related to the card.
   */
  references: string[];
}

/**
 * Metadata block returned in each `SearchListItem`.
 */
export interface SearchListItemMetadata {
  key: string;
  provider: string;
  directory: string;
  model: string;
  type: string;
  maker: string;
  refs: string;
  uid: string;
}

/**
 * Response returned from `POST /api/card`.
 */
export interface GetPromptResponse {
  /**
   * Prompt text.
   */
  prompt: string;
  /**
   * Indicates request success.
   */
  success: boolean;
}

/**
 * Configuration options for `DaimsClient`.
 */
export interface DaimsClientOptions {
  /**
   * API key used for x-api-key authentication.
   * If omitted, requests will be sent without authorization.
   */
  apiKey?: string;
  /**
   * Request timeout in milliseconds.
   *
   * @default 10000
   * @unit milliseconds
   */
  timeoutMs?: number;
  /**
   * Custom `fetch` implementation.
   *
   * If omitted, `globalThis.fetch` is used.
   */
  fetch?: typeof fetch;
}
