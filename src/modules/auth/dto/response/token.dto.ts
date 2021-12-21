import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  accessToken: string;

  constructor(data: { accessToken: string }) {
    this.accessToken = data.accessToken;
  }
}
