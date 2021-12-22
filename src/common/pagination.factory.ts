import { PaginationRequestDto, PaginationResponseDto } from './pagination.dto';

export class PaginationFactory {
  static create<SortBy extends string, T>(
    paginationRequestDto: PaginationRequestDto<SortBy>,
    { data, count }: { count: number; data: T[] },
  ) {
    return new PaginationResponseDto({
      data,
      totalElements: count,
      totalPages: Math.ceil(count / paginationRequestDto.pageSize),
      currentPage: paginationRequestDto.pageNumber,
    });
  }
}
