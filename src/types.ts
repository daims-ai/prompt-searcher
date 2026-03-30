/**
 * Parameters for `POST /api/search`.
 */
export interface SearchRequestParams {
  /**
   * Card category to search in.
   */
  card_type: 'create' | 'edit'
  /**
   * Search mode for the query value.
   */
  search_type: 'keyword' | 'style' | 'object'
  /**
   * Search query string.
   */
  value: string
  /**
   * Optional reference URL used by the API for context.
   */
  link?: string
  /**
   * Indicates whether the input should be treated as a photo reference.
   */
  isPhoto?: boolean
}

/**
 * Paginated payload returned in `data` from `POST /api/search`.
 */
export interface SearchListResponse {
  /**
   * Total number of matched items.
   */
  count: number
  /**
   * Whether more pages are available after this response.
   */
  hasNext: boolean
  /**
   * Page size used by the API.
   */
  limit: number
  /**
   * Current page offset.
   */
  offset: number
  /**
   * Search result items for the current page.
   */
  items: SearchListItem[]
}

/**
 * Response returned from `POST /api/search`.
 */
export interface SearchResponse {
  /**
   * Paginated search payload.
   */
  data: SearchListResponse
  /**
   * Indicates request success.
   */
  success: boolean
}

/**
 * Search result item from `POST /api/search`.
 */
export interface SearchListItem {
  /**
   * Unique card identifier.
   */
  id: string
  /**
   * Metadata describing the card and model/provider context.
   */
  metadata: SearchListItemMetadata
  /**
   * Reference URLs related to the card.
   */
  references: string[]
}

/**
 * Metadata block returned in each `SearchListItem`.
 */
export interface SearchListItemMetadata {
  key: string
  provider: string
  directory: string
  model: string
  type: string
  maker: string
  refs: string
  uid: string
}

/**
 * Response returned from `POST /api/card`.
 */
export interface GetPromptResponse {
  /**
   * Prompt text.
   */
  prompt: string
  /**
   * Indicates request success.
   */
  success: boolean
}

/**
 * Request payload for `POST /me/generate`.
 */
export interface GeneratePromptRequest {
  /**
   * Card key returned from search results (required).
   */
  skey: string
  /**
   * Base64 image to apply the prompt to (optional).
   */
  origin?: string
  /**
   * Custom prompt to use instead of extracting from card (optional).
   */
  apply_prompt?: string
}

/**
 * Response returned from `POST /me/generate`.
 */
export interface GeneratePromptResponse {
  /**
   * Generated result key. Use this key to fetch history with type 'gen'.
   */
  data: string
  /**
   * Indicates request success.
   */
  success: boolean
}

/**
 * History item returned from `GET /history/:type`.
 */
export interface HistoryItem {
  /**
   * Unique history item identifier.
   */
  _id?: string
  /**
   * User ID associated with this history item.
   */
  uid?: string
  /**
   * Type of history item (e.g., 'gen').
   */
  type?: string
  /**
   * Status of the history item.
   */
  status?: string
  /**
   * Additional data specific to the history item.
   */
  data?: unknown
  /**
   * Creation timestamp.
   */
  createdAt?: string | Date
  /**
   * Additional metadata.
   */
  [key: string]: unknown
}

/**
 * Response returned from `GET /history/:type`.
 */
export interface GetHistoryResponse {
  /**
   * List of history items.
   */
  data: HistoryItem[]
  /**
   * Cursor for fetching the next page.
   */
  nextCursor: string | null
  /**
   * Indicates request success.
   */
  success: boolean
}

/**
 * Configuration options for `DaimsClient`.
 */
export interface DaimsClientOptions {
  /**
   * API key used for x-api-key authentication.
   * If omitted, requests will be sent without authorization.
   */
  apiKey?: string
  /**
   * Base URL for the API.
   *
   * @default 'https://api.daims.ai'
   */
  apiBaseUrl?: string
  /**
   * Base URL for the image storage.
   * Search result images are served from this address.
   * To retrieve an image, use `${imageBaseUrl}/${metadata.key}`.
   *
   * @default 'https://asset.daims.ai/images'
   */
  imageBaseUrl?: string
  /**
   * Request timeout in milliseconds.
   *
   * @default 10000
   * @unit milliseconds
   */
  timeoutMs?: number
  /**
   * Custom `fetch` implementation.
   *
   * If omitted, `globalThis.fetch` is used.
   */
  fetch?: typeof fetch
}

/**
 * Workflow execution data passed to the workflow runner.
 */
export interface WorkflowData {
  [key: string]: unknown
}

/**
 * Response from `POST /run_a_sync`.
 */
export interface RunWorkflowResponse {
  /**
   * Unique workflow execution identifier.
   */
  id: string
  /**
   * Initial status of the workflow.
   */
  status: string
}

/**
 * Response from `GET /status/:id`.
 */
export interface WorkflowStatusResponse {
  /**
   * Workflow execution identifier.
   */
  id: string
  /**
   * Current status of the workflow ('running', 'done', 'error', etc.).
   */
  status: string
  /**
   * Additional status data.
   */
  data?: unknown
}

/**
 * Options for workflow execution.
 */
export interface RunWorkflowOptions {
  /**
   * Workflow execution data.
   */
  data: WorkflowData
  /**
   * Polling interval in milliseconds.
   *
   * @default 5000
   * @unit milliseconds
   */
  pollIntervalMs?: number
  /**
   * Maximum polling time in milliseconds.
   *
   * @default 300000 (5 minutes)
   * @unit milliseconds
   */
  maxPollTimeMs?: number
  /**
   * Download path for the result file (relative to project root).
   *
   * @default './data/{id}.json'
   */
  downloadPath?: string
  /**
   * Host URL for workflow execution.
   *
   * @default 'https://sk-pkg.daims.ai'
   */
  workflowHost?: string
  /**
   * Custom `fetch` implementation for download/delete operations.
   */
  fetch?: typeof fetch
}

/**
 * Result of a workflow execution.
 */
export interface RunWorkflowResult {
  /**
   * Workflow execution identifier.
   */
  id: string
  /**
   * Final status of the workflow.
   */
  status: string
  /**
   * Download path if the workflow completed successfully.
   */
  downloadPath?: string
  /**
   * Status response data.
   */
  statusData?: WorkflowStatusResponse
}
