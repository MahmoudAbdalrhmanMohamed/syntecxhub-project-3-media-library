export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface StandardApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}
