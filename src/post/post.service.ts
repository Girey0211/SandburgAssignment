import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Role, User } from '@prisma/client';
import Category from './enum/Category';
import { NoPermissionException } from './exception/noPermission.exception';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(
    { title, content, category }: CreatePostDto,
    user: User
  ) {
    if(user.role == Role.USER && category != Category.FREE)
      throw new NoPermissionException()
    return this.prismaService.post.create({
      data:{
        title,
        content,
        category,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  }

  async getPosts(lastId: number, category: Category, user: User) {
    if(user.role == Role.USER && category == Category.MANAGE)
      throw new NoPermissionException()

    const limit = 20
    return this.prismaService.post.findMany({
      take: limit,
      skip: lastId == 0 ? 1 : 0,
      where: {
        category
      },
      ...(lastId == 0 && {cursor: { postId: lastId }})
    })
  }
}