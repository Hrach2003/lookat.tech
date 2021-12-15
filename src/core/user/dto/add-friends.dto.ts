import { IsInt } from 'class-validator';

export class AddFriendsDto {
  @IsInt({ each: true })
  friendIds: number[];
}
