import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddFriendsDto {
  @ApiProperty({ type: [Number] })
  @IsInt({ each: true })
  friendIds: number[];
}
