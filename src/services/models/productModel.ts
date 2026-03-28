export interface GetProductsResponse {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
}

export interface GetProductsQuery {
  page: number;
  pageSize: number;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  categoryId: number;
}
