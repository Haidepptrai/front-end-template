import axios, { AxiosError } from 'axios';
import { createApiError, ProblemDetails } from './common/ApiError';

const httpClient = axios.create({
  // Use a relative base so requests stay on the same origin (Next.js proxy).
  // next.config.ts rewrites /api/* → NEXT_PUBLIC_API_BASE_URL/api/*
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Response interceptor — transforms backend ProblemDetails error bodies into
 * typed ApiError instances so service callers can handle errors uniformly.
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    const body = error.response?.data;

    // Detect ProblemDetails: must have a numeric `status` and a `title` string.
    if (
      body &&
      typeof body.status === 'number' &&
      typeof body.title === 'string'
    ) {
      return Promise.reject(createApiError(body));
    }

    // Not a ProblemDetails response — re-throw the original Axios error.
    return Promise.reject(error);
  }
);

export default httpClient;
