import toast from 'react-hot-toast';
import { isApiError } from '@/services/common/ApiError';

/**
 * Utility wrappers around react-hot-toast for consistent styling/behavior.
 */
export const toastUtils = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
};

/**
 * Reusable catch handler for API services.
 * Extracts the error detail if it's an ApiError (from backend ProblemDetails),
 * or falls back to the provided default message.
 * Calls toast.error() to display to the user, and returns the unified ApiResponse format.
 *
 * @param error The caught error
 * @param fallbackMsg Default error message
 * @param fallbackData Structure to return in 'data' field (e.g. [], null)
 */
export function handleServiceError<T>(
  error: unknown,
  fallbackMsg: string,
  fallbackData: T
) {
  const msg = isApiError(error) ? error.detail : fallbackMsg;
  toastUtils.error(msg);
  return { data: fallbackData, message: msg };
}
