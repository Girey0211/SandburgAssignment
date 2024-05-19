import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Prisma, Role, User } from '@prisma/client';
import Category from './enum/Category';
import { NoPermissionException } from './exception/noPermission.exception';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaError } from '../util/prismaError';
import { PostNotFoundException } from './exception/postNotFound.exception';
import { PostResponseDto } from './dto/postResponse.dto';
import { PostListResponseDto } from './dto/postListResponse.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createPost(
    { title, content, category }: CreatePostDto,
    user: User,
  ): Promise<PostResponseDto> {
    if (user.role == Role.USER && category != Category.FREE)
      throw new NoPermissionException();
    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        category,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      category: post.category,
      userId: user.id,
    };
  }

  async getPosts(lastId: number, category: Category, user: User): Promise<PostListResponseDto[]> {
    if (user.role == Role.USER && category == Category.MANAGE)
      throw new NoPermissionException();

    const limit = 20;
    const posts = await this.prismaService.post.findMany({
      take: limit,
      skip: lastId == 0 ? 1 : 0,
      where: {
        category,
      },
      ...(lastId == 0 && { cursor: { postId: lastId } }),
      include: {
        user: true,
      },
    });
    return posts.map(post => ({
      postId: post.postId,
      title: post.title,
      userId: post.user.id,
    }));
  }

  async getPostById(postId: number, user: User): Promise<PostResponseDto> {
    const post = await this.prismaService.post.findUnique({
      where: { postId: +postId, },
      include: { user: true, },
    });
    if (user.role == Role.USER && post.category == Category.MANAGE)
      throw new NoPermissionException();
    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      category: post.category,
      userId: post.user.id,
    }
  }

  async updatePost(postId: number, dto: UpdatePostDto, user: User): Promise<PostResponseDto> {
    const post = await this.prismaService.post.findUnique({
      where: { postId: +postId, },
    });
    if (
      (user.role == Role.USER && post.category != Category.FREE) ||
      (user.role == Role.USER && user.userId != post.userId)
    )
      throw new NoPermissionException();
    try {
      const post = await this.prismaService.post.update({
        data: {
          ...dto,
          postId: undefined,
        },
        where: {
          postId: +postId,
        },
        include: {
          user: true,
        },
      });
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        category: post.category,
        userId: post.user.id,
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(postId);
      }
      throw error;
    }
  }

  async deletePost(postId: number, user: User): Promise<PostResponseDto> {
    const post = await this.prismaService.post.findUnique({
      where: { postId: +postId, },
      include: { user: true, },
    });
    if ((user.role == Role.USER && post.category != Category.FREE) ||
        (user.role == Role.USER && user.userId != post.userId))
      throw new NoPermissionException();

    try {
      await this.prismaService.post.delete({
        where: {
          postId: +postId,
        },
      });
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        category: post.category,
        userId: post.user.id,
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(postId);
      }
      throw error;
    }
  }
}