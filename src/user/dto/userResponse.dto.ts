import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    example: 'user1234@gmail.com',
    description: '유저 이메일',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'user1234',
    description: '유저 아이디',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'USER/ADMIN',
    description: '유저 권한',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}