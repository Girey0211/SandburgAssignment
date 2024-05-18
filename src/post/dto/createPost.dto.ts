import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Category from '../enum/Category';

export class CreatePostDto {
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

}
// title: string;
// content: string;
// category: Category;
// USER ADMIN
// FREE NOTICE MANAGE