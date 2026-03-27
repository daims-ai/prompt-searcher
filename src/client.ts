import { DaimsApiError } from './errors'
import { requestJson } from './http'
import type {
  DaimsClientOptions,
  GeneratePromptRequest,
  GeneratePromptResponse,
  GetHistoryResponse,
  GetPromptResponse,
  HistoryItem,
  SearchResponse,
  SearchRequestParams
} from './types'

/**
 * API client for interacting with the DAIMS endpoints.
 */
export class DaimsClient {
  /**
   * Base URL for the API.
   */
  public readonly apiBaseUrl: string
  /**
   * Base URL for the image storage.
   * Search result images are served from this address.
   * To retrieve an image, use `${imageBaseUrl}/${metadata.key}`.
   */
  public readonly imageBaseUrl: string
  /**
   * The API key limits the number of search results.
   * To obtain a key, visit https://daims.ai.
   */
  private readonly apiKey?: string
  private readonly timeoutMs?: number
  private readonly fetchImpl?: typeof fetch

  /**
   * Creates a new DAIMS API client.
   *
   * @param options - Client configuration.
   */
  constructor(options: DaimsClientOptions = {}) {
    this.apiBaseUrl = options.apiBaseUrl ?? 'https://api.daims.ai'
    this.imageBaseUrl = options.imageBaseUrl ?? 'https://asset.daims.ai/images'
    this.apiKey = options.apiKey
    this.timeoutMs = options.timeoutMs
    this.fetchImpl = options.fetch
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
      value: params.value
    }

    if (params.link !== undefined) {
      body.link = params.link
    }

    if (params.isPhoto !== undefined) {
      body.isPhoto = params.isPhoto
    }

    return requestJson<SearchResponse>({
      apiKey: this.apiKey,
      path: '/api/search',
      body,
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
      apiBaseUrl: this.apiBaseUrl
    })
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
      throw new DaimsApiError('skey is required.', {
        code: 'VALIDATION_ERROR'
      })
    }

    return requestJson<GetPromptResponse>({
      apiKey: this.apiKey,
      path: '/api/card',
      body: { skey },
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
      apiBaseUrl: this.apiBaseUrl
    })
  }

  /**
   * Generates a result by applying a prompt to an image.
   *
   * Sends `POST /me/generate`, then polls history until completion.
   *
   * @param request - Generate prompt request with skey (required), origin (optional), and apply_prompt (optional).
   * @param pollOptions - Polling options: intervalMs (default 3000), timeoutMs (default 30000).
   * @returns Generate prompt response with final history item data.
   * @throws {DaimsApiError} If `skey` is missing or the request fails.
   */
  async generatePrompt(
    request: GeneratePromptRequest,
    pollOptions?: {
      intervalMs?: number
      timeoutMs?: number
    }
  ): Promise<GeneratePromptResponse & { historyItem?: HistoryItem }> {
    if (!request.skey) {
      throw new DaimsApiError('skey is required.', {
        code: 'VALIDATION_ERROR'
      })
    }

    const body: Record<string, unknown> = {
      skey: request.skey
    }

    if (request.origin !== undefined) {
      body.origin = request.origin
    }

    if (request.apply_prompt !== undefined) {
      body.apply_prompt = request.apply_prompt
    }

    const generateResult = await requestJson<GeneratePromptResponse>({
      apiKey: this.apiKey,
      path: '/me/generate',
      body,
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
      apiBaseUrl: this.apiBaseUrl
    })

    const historyKey = generateResult.data
    const intervalMs = pollOptions?.intervalMs ?? 3000
    const timeoutMs = pollOptions?.timeoutMs ?? 30000
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
      try {
        const historyResult = await this.getHistory('gen', { limit: 100 })
        const item = historyResult.data.find((d) => d.data === historyKey || d._id === historyKey)

        if (item) {
          if (item.status === 'completed' || item.status === 'success') {
            return { ...generateResult, historyItem: item }
          }
          if (item.status === 'failed' || item.status === 'error') {
            return { ...generateResult, historyItem: item }
          }
        }
      } catch {
        // Ignore polling errors and continue
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }

    return generateResult
  }

  /**
   * Retrieves history items by type.
   *
   * Sends `GET /history/:type`.
   *
   * @param type - History type ('gen' or other types).
   * @param options - Optional pagination and filter options.
   * @returns History list response with data and nextCursor.
   * @throws {DaimsApiError} If the request fails.
   */
  async getHistory(
    type: string,
    options?: {
      limit?: number
      cursor?: string
      status?: string
    }
  ): Promise<GetHistoryResponse> {
    const searchParams = new URLSearchParams()
    if (options?.limit !== undefined) {
      searchParams.append('limit', String(options.limit))
    }
    if (options?.cursor !== undefined) {
      searchParams.append('cursor', options.cursor)
    }
    if (options?.status !== undefined) {
      searchParams.append('status', options.status)
    }

    const queryString = searchParams.toString()
    const path = `/history/${type}${queryString ? '?' + queryString : ''}`

    return requestJson<GetHistoryResponse>({
      apiKey: this.apiKey,
      path,
      body: undefined,
      timeoutMs: this.timeoutMs,
      fetchImpl: this.fetchImpl,
      apiBaseUrl: this.apiBaseUrl
    })
  }
}
