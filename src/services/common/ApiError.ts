/**
 * Matches the RFC 7807 ProblemDetails shape returned by the backend's
 * GlobalExceptionHandler for 4xx / 5xx responses.
 */
export interface ProblemDetails {
  status: number;
  title: string;
  detail: string;
  /** Optional extra fields added by ASP.NET Core (type, instance, etc.) */
  type?: string;
  instance?: string;
  [key: string]: unknown;
}

/**
 * Typed error interface for backend ProblemDetails.
 */
export interface ApiError extends Error {
  isApiError: true;
  status: number;
  title: string;
  detail: string;
  raw: ProblemDetails;
}

/**
 * Factory function to create an ApiError object from ProblemDetails.
 */
export const createApiError = (problem: ProblemDetails): ApiError => {
  const error = new Error(problem.detail ?? problem.title) as ApiError;
  error.name = 'ApiError';
  error.isApiError = true;
  error.status = problem.status;
  error.title = problem.title;
  error.detail = problem.detail;
  error.raw = problem;
  return error;
};

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isApiError' in error &&
    (error as Record<string, unknown>).isApiError === true
  );
};

export const isNotFoundError = (error: unknown): boolean =>
  isApiError(error) && error.status === 404;
export const isBadRequestError = (error: unknown): boolean =>
  isApiError(error) && error.status === 400;
export const isConflictError = (error: unknown): boolean =>
  isApiError(error) && error.status === 409;
export const isServerError = (error: unknown): boolean =>
  isApiError(error) && error.status >= 500;
