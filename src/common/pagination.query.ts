import { PaginationRequestDto } from './pagination.dto';

export function paginationQuery<T extends string>(
  paginationRequest: PaginationRequestDto<T>,
) {
  return {
    orderBy: {
      [paginationRequest.sortBy]: paginationRequest.sortDirection,
    },
    take: paginationRequest.pageSize,
    skip: paginationRequest.pageSize * (paginationRequest.pageNumber - 1),
  };
}
