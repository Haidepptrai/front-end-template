import { ApiResponse } from './common/ApiResponse';
import httpClient from './httpClient';
import { handleServiceError } from '@/utils/toastUtils';
import {
  CreateProductRequest,
  GetProductsQuery,
  GetProductsResponse,
  UpdateProductRequest,
} from './models/productModel';
import { PagedResult } from './models/paginationModel';

const ENDPOINT = '/api/Product';

/**
 * Fetch all products with pagination.
 * GET /api/Product
 *
 * @returns Paged result of products.
 * @throws {ApiError} when the backend responds with a ProblemDetails error.
 */
export async function getProducts(
  query: GetProductsQuery
): Promise<PagedResult<GetProductsResponse> | null> {
  try {
    const { data } = await httpClient.get<PagedResult<GetProductsResponse>>(
      ENDPOINT,
      { params: query }
    );
    return data;
  } catch (error) {
    // getProducts doesn't use standard ApiResponse, it uses PagedResult, so return null
    handleServiceError(error, 'Failed to fetch products', null);
    return null;
  }
}

/**
 * Fetch a single product by ID.
 * GET /api/Product/{id}
 *
 * @returns ApiResponse wrapping the matched product.
 * @throws {ApiError} 404 when the product does not exist.
 * @throws {ApiError} for any other backend error.
 */
export async function getProductById(
  id: number
): Promise<ApiResponse<GetProductsResponse | null>> {
  try {
    const { data } = await httpClient.get<ApiResponse<GetProductsResponse>>(
      `${ENDPOINT}/${id}`
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to fetch product', null);
  }
}

/**
 * Create a new product.
 * POST /api/Product
 *
 * @returns ApiResponse wrapping the created product.
 * @throws {ApiError} 400 on validation failure.
 * @throws {ApiError} 409 if a product with the same identifier already exists.
 */
export async function createProduct(
  payload: CreateProductRequest
): Promise<ApiResponse<GetProductsResponse | null>> {
  try {
    const { data } = await httpClient.post<ApiResponse<GetProductsResponse>>(
      ENDPOINT,
      payload
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to create product', null);
  }
}

/**
 * Update an existing product.
 * PUT /api/Product/{id}
 *
 * @returns ApiResponse wrapping the updated product.
 * @throws {ApiError} 404 when the product does not exist.
 * @throws {ApiError} 400 on validation failure.
 */
export async function updateProduct(
  id: number,
  payload: UpdateProductRequest
): Promise<ApiResponse<GetProductsResponse | null>> {
  try {
    const { data } = await httpClient.put<ApiResponse<GetProductsResponse>>(
      `${ENDPOINT}/${id}`,
      payload
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to update product', null);
  }
}

/**
 * Delete a product by ID.
 * DELETE /api/Product/{id}
 *
 * @returns ApiResponse with a null data payload on success.
 * @throws {ApiError} 404 when the product does not exist.
 */
export async function deleteProduct(
  id: number
): Promise<ApiResponse<string | null>> {
  try {
    const { data } = await httpClient.delete<ApiResponse<string | null>>(
      `${ENDPOINT}/${id}`
    );
    return data;
  } catch (error) {
    return handleServiceError(error, 'Failed to delete product', null);
  }
}
