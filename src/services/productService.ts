import httpClient from './httpClient';
import { GetProductsResponse, GetProductsQuery, CreateProductRequest, UpdateProductRequest } from './models/productModel';
import { PagedResult } from './models/paginationModel';

const ENDPOINT = '/api/Product';

/**
 * Fetch all products with pagination.
 * GET /api/Product
 */
export async function getProducts(query: GetProductsQuery): Promise<PagedResult<GetProductsResponse>> {
  try {
    const { data } = await httpClient.get<PagedResult<GetProductsResponse>>(ENDPOINT, {
      params: query,
    });
    return data;
  } catch (error) {
    console.error('[productService] getProducts failed:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID.
 * GET /api/Product/{id}
 */
export async function getProductById(id: number): Promise<GetProductsResponse> {
  try {
    const { data } = await httpClient.get<GetProductsResponse>(`${ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    console.error(`[productService] getProductById(${id}) failed:`, error);
    throw error;
  }
}

/**
 * Create a new product.
 * POST /api/Product
 */
export async function createProduct(payload: CreateProductRequest): Promise<void> {
  try {
    await httpClient.post(ENDPOINT, payload);
  } catch (error) {
    console.error('[productService] createProduct failed:', error);
    throw error;
  }
}

/**
 * Update an existing product.
 * PUT /api/Product/{id}
 */
export async function updateProduct(id: number, payload: UpdateProductRequest): Promise<void> {
  try {
    await httpClient.put(`${ENDPOINT}/${id}`, payload);
  } catch (error) {
    console.error(`[productService] updateProduct(${id}) failed:`, error);
    throw error;
  }
}

/**
 * Delete a product by ID.
 * DELETE /api/Product/{id}
 */
export async function deleteProduct(id: number): Promise<void> {
  try {
    await httpClient.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`[productService] deleteProduct(${id}) failed:`, error);
    throw error;
  }
}
