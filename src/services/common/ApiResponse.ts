export interface ApiResponse<T> {
  data: T;
  message: string | null;
}

export interface ApiResponseWithMetadata<T> {
  data: T;
  message: string | null;
  metadata: PaginationMetadata;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
