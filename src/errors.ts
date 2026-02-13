/**
 * Additional context for `DaimsApiError`.
 */
export interface DaimsApiErrorOptions {
  /**
   * HTTP status code when the server responded with a non-2xx status.
   */
  status?: number;
  /**
   * Machine-readable error code.
   */
  code?: string;
  /**
   * Parsed response body for HTTP errors, when available.
   */
  responseBody?: unknown;
  /**
   * Underlying error cause from the runtime or network layer.
   */
  cause?: unknown;
}

/**
 * Error thrown by the DAIMS SDK for configuration, request, timeout, and API failures.
 */
export class DaimsApiError extends Error {
  /**
   * HTTP status code for API failures.
   */
  readonly status?: number;
  /**
   * SDK or API error code.
   */
  readonly code?: string;
  /**
   * Parsed API error payload, if available.
   */
  readonly responseBody?: unknown;

  /**
   * Creates a `DaimsApiError` instance.
   */
  constructor(message: string, options: DaimsApiErrorOptions = {}) {
    super(message);
    this.name = "DaimsApiError";
    this.status = options.status;
    this.code = options.code;
    this.responseBody = options.responseBody;

    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}
