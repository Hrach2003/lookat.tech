import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class PaginationResponseDto<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;

  constructor(response: PaginationResponseDto<T>) {
    Object.assign(this, response);
  }
}

export class PaginationRequestDto<T extends string> {
  @ApiPropertyOptional({
    minimum: 0,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly pageNumber = 1;

  @ApiPropertyOptional({
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @IsOptional()
  readonly pageSize = 10;

  @ApiPropertyOptional({
    enum: Prisma.SortOrder,
  })
  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  readonly sortDirection: Prisma.SortOrder;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((dto) => !!dto?.sortDirection)
  readonly sortBy: T;
}
