import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import RequestWithUser from '../authentication/requsetWithUser.interface';
import { CreatePostDto } from './dto/createPost.dto';
import JwtAuthenticationGuard from '../authentication/guard/JwtAuthenticationGuard';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import Category from './enum/Category';
import { FindOneParams } from '../util/findOneParam';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostListResponseDto } from './dto/postListResponse.dto';

@ApiTags('Post')
@Controller('post')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 등록 API' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Successful response' })
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() request: RequestWithUser
  ): Promise<PostResponseDto> {
    return this.postService.createPost(dto, request.user)
  }

  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '카테고리별 게시물 조회 API' })
  @ApiQuery({ name: 'lastId', required: false, type: Number, description: '마지막 게시물 ID' })
  @ApiQuery({ name: 'category', required: false, type: String, description: '게시판 카테고리(FREE/NOTICE/MANAGE)'})
  @ApiOkResponse({ type: [PostListResponseDto], description: 'Successful response' })
  async getPosts(
    @Query() lastId: number,
    @Query() category: Category = Category.FREE,
    @Req() request: RequestWithUser,
  ):Promise<PostListResponseDto[]> {
    return this.postService.getPosts(lastId, category, request.user)
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 조회 API' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Successful response' })
  async getOnePost(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
  ):Promise<PostResponseDto> {
    return this.postService.getPostById(id, request.user)
  }
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 수정 API' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Successful response' })
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() dto: UpdatePostDto,
    @Req() request: RequestWithUser,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, dto, request.user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: '게시물 삭제 API' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Successful response' })
  async deletePost(
    @Param() { id }: FindOneParams,
    @Req() request: RequestWithUser,
  ): Promise<PostResponseDto> {
    return this.postService.deletePost(id, request.user)
  }
}