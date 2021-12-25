import { Prisma } from '@prisma/client';
import { PaginationRequestDto } from '../../../../common/pagination/pagination.dto';

export type PostOrderBy = keyof Prisma.PostOrderByWithRelationInput;
export class PostPaginationRequest extends PaginationRequestDto<PostOrderBy> {}
