export interface IResponse<T> {
  message: string;
  data: T;
}

export interface IResponsePagination<T> {
  message: string;
  data: {
    data: T;
    page: number;
    hasMore: boolean;
    total: number;
    totalPages: number;
  };
}

export interface IPaginationQueries {
  page?: number;
  limit?: number;
}
