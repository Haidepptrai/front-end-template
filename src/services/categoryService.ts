import httpClient from './httpClient';
import {
  CategoryEntity,
  CreateCategoryRequest,
  GetCategoriesResponse,
} from './models/categoryModel';

const ENDPOINT = '/api/Category';

/**
 * Fetch all categories.
 * GET /api/Category
 */
export async function getCategories(): Promise<GetCategoriesResponse[]> {
  try {
    const { data } = await httpClient.get<GetCategoriesResponse[]>(ENDPOINT);
    return data;
  } catch (error) {
    console.error('[categoryService] getCategories failed:', error);
    throw error;
  }
}

/**
 * Fetch a single category by ID.
 * GET /api/Category/{id}
 */
export async function getCategoryById(id: number): Promise<CategoryEntity> {
  try {
    const { data } = await httpClient.get<CategoryEntity>(`${ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    console.error(`[categoryService] getCategoryById(${id}) failed:`, error);
    throw error;
  }
}

/**
 * Create a new category.
 * POST /api/Category
 */
export async function createCategory(
  payload: CreateCategoryRequest
): Promise<void> {
  try {
    await httpClient.post(ENDPOINT, payload);
  } catch (error) {
    console.error('[categoryService] createCategory failed:', error);
    throw error;
  }
}

/**
 * Update an existing category.
 * PUT /api/Category/{id}
 */
export async function updateCategory(
  id: number,
  payload: CategoryEntity
): Promise<void> {
  try {
    await httpClient.put(`${ENDPOINT}/${id}`, payload);
  } catch (error) {
    console.error(`[categoryService] updateCategory(${id}) failed:`, error);
    throw error;
  }
}

/**
 * Delete a category by ID.
 * DELETE /api/Category/{id}
 */
export async function deleteCategory(id: number): Promise<void> {
  try {
    await httpClient.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`[categoryService] deleteCategory(${id}) failed:`, error);
    throw error;
  }
}
