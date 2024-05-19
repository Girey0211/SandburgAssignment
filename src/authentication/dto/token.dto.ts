import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class TokenDto {
  constructor(token: string) {
    this.token = token
  }
  @ApiProperty({ description: '토큰' })
  @IsString()
  token: string;
}