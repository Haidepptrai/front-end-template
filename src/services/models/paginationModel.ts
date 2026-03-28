export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PagedResult<T> {
  data: T[];
  metadata: PaginationMetadata;
}
