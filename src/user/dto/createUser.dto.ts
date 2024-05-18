import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import Role from '../enum/Role';

export class CreateUserDto {
  @ApiProperty({
    example: 'user1234@gmail.com',
    description: '유저 이메일',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'user1234',
    description: '유저 아이디',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'qwer1234!@',
    description: '비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}