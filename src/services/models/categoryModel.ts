export interface GetCategoriesResponse {
  id: number;
  name: string | null;
  slug: string | null;
}

export interface CreateCategoryRequest {
  name: string | null;
  slug: string | null;
}

export interface CategoryEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string | null;
  slug: string | null;
}
