import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class PostResponseDto {
  @ApiProperty({
    example: '1',
    description: '게시물 고유 아이디',
  })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

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

  @ApiProperty({
    example: 'FREE/NOTICE/MANAGE',
    description: '카테고리',
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    example: 'user1234',
    description: '작성한 유저 아이디',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}