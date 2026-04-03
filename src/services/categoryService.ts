import { ApiResponse } from './common/ApiResponse';
import httpClient from './httpClient';
import { handleServiceError } from '@/utils/toastUtils';
import {
  CategoryEntity,
  CreateCategoryRequest,
  GetCategoriesResponse,
} from './models/categoryModel';

const ENDPOINT = '/api/Category';

/**
 * Fetch all categories.
 * GET /api/Category
 *
 * @returns ApiResponse wrapping the list of categories.
 * @throws {ApiError} when the backend responds with a ProblemDetails error.
 */
export async function getCategories(): Promise<
  ApiResponse<GetCategoriesResponse[]>
> {
  try {
    const { data } =
      await httpClient.get<ApiResponse<GetCategoriesResponse[]>>(ENDPOINT);
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch categories', []);
  }
}

/**
 * Fetch a single category by ID.
 * GET /api/Category/{id}
 *
 * @returns ApiResponse wrapping the matched CategoryEntity.
 * @throws {ApiError} 404 when the category does not exist.
 * @throws {ApiError} for any other backend error.
 */
export async function getCategoryById(
  id: number
): Promise<ApiResponse<CategoryEntity | null>> {
  try {
    const { data } = await httpClient.get<ApiResponse<CategoryEntity>>(
      `${ENDPOINT}/${id}`
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch category', null);
  }
}

/**
 * Create a new category.
 * POST /api/Category
 *
 * @returns ApiResponse wrapping the created CategoryEntity.
 * @throws {ApiError} 400 on validation failure.
 * @throws {ApiError} 409 if a category with the same identifier already exists.
 */
export async function createCategory(
  payload: CreateCategoryRequest
): Promise<ApiResponse<CategoryEntity | null>> {
  try {
    const { data } = await httpClient.post<ApiResponse<CategoryEntity>>(
      ENDPOINT,
      payload
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to create category', null);
  }
}

/**
 * Update an existing category.
 * PUT /api/Category/{id}
 *
 * @returns ApiResponse wrapping the updated CategoryEntity.
 * @throws {ApiError} 404 when the category does not exist.
 * @throws {ApiError} 400 on validation failure.
 */
export async function updateCategory(
  id: number,
  payload: CategoryEntity
): Promise<ApiResponse<CategoryEntity | null>> {
  try {
    const { data } = await httpClient.put<ApiResponse<CategoryEntity>>(
      `${ENDPOINT}/${id}`,
      payload
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to update category', null);
  }
}

/**
 * Delete a category by ID.
 * DELETE /api/Category/{id}
 *
 * @returns ApiResponse with a null data payload on success.
 * @throws {ApiError} 404 when the category does not exist.
 */
export async function deleteCategory(
  id: number
): Promise<ApiResponse<string | null>> {
  try {
    const { data } = await httpClient.delete<ApiResponse<string | null>>(
      `${ENDPOINT}/${id}`
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to delete category', null);
  }
}
