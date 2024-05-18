import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundException } from './exception/userNotFound.exception';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto) {
    const { id, email, password, role } = user
    return this.prismaService.user.create({
      data: {
        id, email, password, role
      }
    });
  }

  async getById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async deleteUser(userId: number) {
    await this.prismaService.user.delete({
      where: {
        userId
      }
    })
  }
}