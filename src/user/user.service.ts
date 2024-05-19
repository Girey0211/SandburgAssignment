import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundException } from './exception/userNotFound.exception';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaError } from '../util/prismaError';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ id, email, password, role }: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prismaService.user.create({
      data: {
        id, email, password, role
      }
    });
    return {
      email: user.email,
      id: user.id,
      role: user.role,
    }
  }

  async getById(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    return user
  }

  async getByEmail(email: string): Promise<User> {
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

  async deleteUser(userId: number): Promise<UserResponseDto> {
    try {
      const user = await this.prismaService.user.delete({
        where: {
          userId
        }
      })
      return {
        email: user.email,
        id: user.id,
        role: user.role,
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      )
        throw new UserNotFoundException();
      throw error;
    }
  }
}