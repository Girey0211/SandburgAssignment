import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostListResponseDto {
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
    example: 'user1234',
    description: '작성한 유저 아이디',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}