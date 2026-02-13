export interface DaimsApiErrorOptions {
  status?: number;
  code?: string;
  responseBody?: unknown;
  cause?: unknown;
}

export class DaimsApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly responseBody?: unknown;

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
