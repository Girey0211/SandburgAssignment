import { Body, Controller, Get, Param, ParseEnumPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import RequestWithUser from '../authentication/requsetWithUser.interface';
import { CreatePostDto } from './dto/createPost.dto';
import JwtAuthenticationGuard from '../authentication/guard/JwtAuthenticationGuard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import Category from './enum/Category';
import { CategoryPipe } from './category.pipe';

@ApiTags('Post')
@Controller('post')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 등록 API' })
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() request: RequestWithUser
  ) {
    return this.postService.createPost(dto, request.user)
  }

  @Get(':category')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 조회 API' })
  async getFreePosts(
    @Query() lastId: number,
    @Param('category', CategoryPipe) category: Category,
    @Req() request: RequestWithUser,
  ) {
    return this.postService.getPosts(lastId, category, request.user)
  }

}