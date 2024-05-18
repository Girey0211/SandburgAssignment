import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignupDto {
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
    example: 'qwer@1234',
    description: '유저 비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}