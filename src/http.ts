import { DaimsApiError } from './errors'
import * as fs from 'node:fs'
import * as path from 'node:path'

interface RequestJsonOptions {
  apiKey?: string
  path: string
  body?: unknown
  timeoutMs?: number
  fetchImpl?: typeof fetch
  apiBaseUrl?: string
}

const DEFAULT_TIMEOUT_MS = 10_000
const DEFAULT_API_BASE_URL = 'https://api.daims.ai'
const DEFAULT_WORKFLOW_HOST = 'https://sk-pkg.daims.ai'

function getMessageFromBody(body: unknown): string | undefined {
  if (typeof body === 'string' && body.length > 0) {
    return body
  }

  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message
    if (typeof message === 'string' && message.length > 0) {
      return message
    }
  }

  return undefined
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.toLowerCase().includes('application/json')

  if (isJson) {
    return response.json()
  }

  const text = await response.text()
  return text.length > 0 ? text : undefined
}

export async function requestJson<T>(options: RequestJsonOptions): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const fetchImpl = options.fetchImpl ?? globalThis.fetch
  const apiBaseUrl = options.apiBaseUrl ?? DEFAULT_API_BASE_URL

  if (typeof fetchImpl !== 'function') {
    throw new DaimsApiError('Global fetch is not available in this runtime.', {
      code: 'FETCH_UNAVAILABLE'
    })
  }

  const controller = new AbortController()
  let didTimeout = false
  const timeoutId = setTimeout(() => {
    didTimeout = true
    controller.abort()
  }, timeoutMs)

  try {
    const url = new URL(options.path, apiBaseUrl).toString()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (options.apiKey) {
      headers['x-api-key'] = options.apiKey
    }
    const response = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(options.body ?? {}),
      signal: controller.signal
    })

    const responseBody = await parseResponseBody(response)

    if (!response.ok) {
      const responseMessage = getMessageFromBody(responseBody)
      throw new DaimsApiError(responseMessage ?? `Request failed with status ${response.status}`, {
        status: response.status,
        code: 'HTTP_ERROR',
        responseBody
      })
    }

    return responseBody as T
  } catch (error: unknown) {
    if (error instanceof DaimsApiError) {
      throw error
    }

    if (didTimeout || (error instanceof Error && error.name === 'AbortError')) {
      throw new DaimsApiError(`Request timed out after ${timeoutMs}ms`, {
        code: 'REQUEST_TIMEOUT',
        cause: error
      })
    }

    throw new DaimsApiError('Network request failed', {
      code: 'NETWORK_ERROR',
      cause: error
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Downloads a file with resume support.
 * Uses Range header to resume partial downloads.
 */
export async function downloadWithResume(
  url: string,
  outputPath: string,
  fetchImpl: typeof fetch
): Promise<void> {
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const existingFile = fs.existsSync(outputPath)
  let startByte = 0

  if (existingFile) {
    startByte = fs.statSync(outputPath).size
  }

  const headers: Record<string, string> = {}
  if (startByte > 0) {
    headers.Range = `bytes=${startByte}-`
  }

  const response = await fetchImpl(url, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new DaimsApiError(`Download failed with status ${response.status}`, {
      code: 'DOWNLOAD_ERROR',
      status: response.status
    })
  }

  const contentLength = response.headers.get('content-length')
  const totalSize = contentLength ? parseInt(contentLength, 10) : 0

  const fileStream = fs.createWriteStream(outputPath, {
    flags: startByte > 0 ? 'a' : 'w'
  })

  const reader = response.body?.getReader()
  if (!reader) {
    throw new DaimsApiError('Response body is not readable', {
      code: 'DOWNLOAD_ERROR'
    })
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      fileStream.write(value)
    }
  } finally {
    reader.releaseLock()
    fileStream.end()
  }
}

/**
 * Deletes a file from the server.
 */
export async function deleteFile(url: string, fetchImpl: typeof fetch): Promise<void> {
  const response = await fetchImpl(url, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new DaimsApiError(`Delete failed with status ${response.status}`, {
      code: 'DELETE_ERROR',
      status: response.status
    })
  }
}
