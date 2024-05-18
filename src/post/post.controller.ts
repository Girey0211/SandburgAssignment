import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import RequestWithUser from '../authentication/requsetWithUser.interface';
import { CreatePostDto } from './dto/createPost.dto';
import JwtAuthenticationGuard from '../authentication/guard/JwtAuthenticationGuard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
