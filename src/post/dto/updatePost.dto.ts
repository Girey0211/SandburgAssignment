import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    example: '부산소마고 이대로 가면...',
    description: '게시물 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '라이더!',
    description: '게시물 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}