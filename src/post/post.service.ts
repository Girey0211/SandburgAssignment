import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Prisma, Role, User } from '@prisma/client';
import Category from './enum/Category';
import { NoPermissionException } from './exception/noPermission.exception';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaError } from '../util/prismaError';
import { PostNotFoundException } from './exception/postNotFound.exception';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createPost(
    { title, content, category }: CreatePostDto,
    user: User,
  ) {
    if (user.role == Role.USER && category != Category.FREE)
      throw new NoPermissionException();
    return this.prismaService.post.create({
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
  }

  async getPosts(lastId: number, category: Category, user: User) {
    if (user.role == Role.USER && category == Category.MANAGE)
      throw new NoPermissionException();

    const limit = 20;
    return this.prismaService.post.findMany({
      take: limit,
      skip: lastId == 0 ? 1 : 0,
      where: {
        category,
      },
      ...(lastId == 0 && { cursor: { postId: lastId } }),
    });
  }

  async updatePost(postId: number, dto: UpdatePostDto, user: User) {
    const post = await this.prismaService.post.findUnique({
      where: {
        postId: +postId,
      },
    });
    if (
      (user.role == Role.USER && post.category != Category.FREE) ||
      (user.role == Role.USER && user.userId != post.userId)
    )
      throw new NoPermissionException();
    try {
      return await this.prismaService.post.update({
        data: {
          ...dto,
          postId: undefined,
        },
        where: {
          postId: +postId,
        },
      });
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

  async deletePost(postId: number, user: User) {
    const post = await this.prismaService.post.findUnique({
      where: {
        postId: +postId,
      },
    });
    if (
      (user.role == Role.USER && post.category != Category.FREE) ||
      (user.role == Role.USER && user.userId != post.userId)
    )
      throw new NoPermissionException();
    try {
      return this.prismaService.post.delete({
        where: {
          postId: +postId,
        },
      });
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